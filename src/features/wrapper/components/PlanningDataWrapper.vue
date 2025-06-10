<script setup lang="ts">
	import { onMounted, Ref, ref } from "vue";

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";
	const planningStore = usePlanningStore();

	// Composables
	import { usePlan } from "@/features/planning_data/usePlan";

	// Types & Interfaces
	import { PlanLoadError } from "@/features/planning_data/usePlan.errors";
	import { IPlanRouteParams } from "@/features/planning_data/usePlan.types";
	import {
		IPlan,
		IPlanEmpireElement,
		IPlanLoadData,
	} from "@/stores/planningStore.types";

	// Components
	import RenderingProgress from "@/layout/components/RenderingProgress.vue";

	// UI
	import { NSpin } from "naive-ui";

	const props = defineProps({
		planetNaturalId: {
			type: String,
			required: false,
		},
		planUuid: {
			type: String,
			required: false,
		},
		sharedPlanUuid: {
			type: String,
			required: false,
		},
		loadCXData: {
			type: Boolean,
			required: false,
			default: false,
		},
	});

	const { loadDefinitionFromRouteParams, isEditDisabled } = usePlan();

	const routeStatus: IPlanRouteParams = {
		planetNaturalId: props.planetNaturalId,
		planUuid: props.planUuid,
		sharedPlanUuid: props.sharedPlanUuid,
	};

	const loading: Ref<boolean> = ref(true);
	const error: Ref<null | PlanLoadError> = ref(null);

	const disabled: Ref<boolean> = ref(isEditDisabled(routeStatus));

	// loaded data
	const planDefinition: Ref<IPlan | null> = ref(null);
	const empireList: Ref<IPlanEmpireElement[] | null> = ref(null);

	async function loadData() {
		loading.value = true;
		error.value = null;

		try {
			// load plan data depending of params from route
			await loadDefinitionFromRouteParams(routeStatus).then(
				(result: IPlanLoadData) => {
					planDefinition.value = result.planData;
					empireList.value = result.empires;
				}
			);

			// fetch cx data if wantes
			if (props.loadCXData) {
				await planningStore.getAllCX();
			}
		} catch (err: any) {
			if (err instanceof PlanLoadError) {
				error.value = err;
			} else {
				error.value = new PlanLoadError("UNKNOWN", `${err}`);
			}

			console.error(error.value);
		} finally {
			loading.value = false;
		}
	}

	onMounted(async () => {
		await loadData();
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
						<n-spin />
						<div class="pt-3">Loading Data..</div>
					</template>
					<template v-else-if="error">
						<div class="font-bold">Error!</div>
						<div class="pt-3">{{ error.message }}</div>
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
				:disabled="disabled"
				:planDefintion="planDefinition"
				:empireList="empireList"
				:loading="loading"
				:error="error"
			/>

			<template #fallback>
				<RenderingProgress />
			</template>
		</Suspense>
	</template>
</template>
