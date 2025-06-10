<script setup lang="ts">
	import { onMounted, ref, Ref } from "vue";

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";
	const planningStore = usePlanningStore();

	// Composables
	import { useCXData } from "@/features/cx/useCXData";
	const { findEmpireCXUuid } = useCXData();

	// Components
	import RenderingProgress from "@/layout/components/RenderingProgress.vue";

	// UI
	import { NSpin, NIcon } from "naive-ui";
	import { CheckSharp } from "@vicons/material";

	import { IPlan, IPlanEmpireElement } from "@/stores/planningStore.types";
	import { EmpireLoadError } from "@/features/empire/useEmpire.errors";

	const props = defineProps({
		empireUuid: {
			type: String,
			required: false,
		},
	});

	const empireList: Ref<IPlanEmpireElement[]> = ref([]);
	const planList: Ref<IPlan[]> = ref([]);
	const empireLoadUuid: Ref<string | undefined> = ref(undefined);
	const planetList: Ref<string[]> = ref([]);

	const loading: Ref<boolean> = ref(true);
	const error: Ref<null | EmpireLoadError> = ref(null);

	const loadingSteps: Ref<
		Record<string, { status: boolean; description: string }>
	> = ref({
		EMPIRES: {
			status: false,
			description: "Empire Information",
		},
		PLANS: {
			status: false,
			description: "Plan Data of Empire",
		},
		CX: {
			status: false,
			description: "Exchange Preferences",
		},
	});

	async function loadEmpireData() {
		loading.value = true;
		error.value = null;

		try {
			const empireLoadList: IPlanEmpireElement[] =
				await planningStore.getAllEmpires();

			loadingSteps.value.EMPIRES.status = true;

			// user has no empires, push an error
			if (empireLoadList.length === 0) {
				error.value = new EmpireLoadError("NO_EMPIRES", "No empires setup.");
				return;
			}

			emit("update:empireList", empireLoadList);

			// prop empire uuid is not a valid uuid of the user
			if (
				props.empireUuid &&
				!empireLoadList.find((e) => e.uuid === props.empireUuid)
			) {
				error.value = new EmpireLoadError(
					"INVALID_UUID",
					`Uuid '${props.empireUuid}' is not a valid empire of yours.`
				);
				return;
			}

			const initialEmpireUuid: string = props.empireUuid
				? props.empireUuid
				: empireLoadList[0].uuid;
			const findEmpire = empireLoadList.find(
				(e) => e.uuid === initialEmpireUuid
			);
			let planUuidList: string[] = [];
			if (findEmpire) {
				planUuidList = findEmpire.baseplanners.map((plan) => plan.uuid);
			}

			// load plan data
			if (planUuidList.length > 0) {
				planList.value = await planningStore.getOrLoadEmpirePlans(
					initialEmpireUuid,
					planUuidList
				);
			}

			loadingSteps.value.PLANS.status = true;

			// load cx preferences
			await planningStore.getAllCX().then(() => {
				loadingSteps.value.CX.status = true;
			});

			empireList.value = empireLoadList;
			empireLoadUuid.value = initialEmpireUuid;

			// create list of planets in plan
			planList.value.forEach((pForPlanet) => {
				if (!planetList.value.includes(pForPlanet.planet_id))
					planetList.value.push(pForPlanet.planet_id);
			});

			// pass on cx uuid to view
			emit("update:cxUuid", findEmpireCXUuid(initialEmpireUuid));

			// pass on empire uuid to view
			emit("update:empireUuid", initialEmpireUuid);
			// pass plans to view
			emit("update:planList", planList.value);
		} catch (err) {
			if (err instanceof EmpireLoadError) {
				error.value = err;
			} else {
				error.value = new EmpireLoadError("UNKNOWN", `${err}`);
			}
		} finally {
			loading.value = false;
		}
	}

	const emit = defineEmits<{
		(e: "update:empireUuid", value: string): void;
		(e: "update:planList", value: IPlan[]): void;
		(e: "update:cxUuid", value: string | undefined): void;
		(e: "update:empireList", value: IPlanEmpireElement[]): void;
	}>();

	onMounted(async () => {
		await loadEmpireData();
	});
</script>

<template>
	<template v-if="loading || error">
		<div
			class="relative w-full h-full bg-center bg-repeat"
			:class="
				loading
					? 'bg-[url(/images/bg_striped_prunplanner.png)]'
					: 'bg-[url(/images/bg_striped_error.png)]'
			"
		>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="bg-black p-8 rounded shadow-lg text-center">
					<template v-if="loading">
						<h1 class="text-2xl font-bold font-mono mb-3">Loading Data..</h1>
						<div
							class="flex flex-row mb-2 align-middle"
							v-for="(elem, index) in Object.values(loadingSteps)"
							:key="index"
						>
							<div class="pr-5">
								<n-spin v-if="!elem.status" :size="20" />
								<n-icon :size="20" v-else>
									<CheckSharp />
								</n-icon>
							</div>
							<div>{{ elem.description }}</div>
						</div>
					</template>
					<template v-else-if="error">
						<div class="font-bold">Error!</div>
						<div>{{ error }}</div>
					</template>
					<template v-else>
						<div class="font-bold">
							Something unexpected happened. Check the Browser Console.
						</div>
					</template>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<Suspense>
			<slot
				:loading="loading"
				:error="error"
				:empire-list="empireList"
				:plan-list="planList"
				:empire-uuid="empireLoadUuid"
				:planet-list="planetList"
			/>

			<template #fallback>
				<RenderingProgress />
			</template>
		</Suspense>
	</template>
</template>
