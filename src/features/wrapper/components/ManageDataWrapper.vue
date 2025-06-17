<script setup lang="ts">
	import { onMounted, ref, Ref } from "vue";

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";
	const planningStore = usePlanningStore();

	// Components
	import RenderingProgress from "@/layout/components/RenderingProgress.vue";

	// Types & Interfaces
	import {
		ICX,
		IPlan,
		IPlanEmpireElement,
	} from "@/stores/planningStore.types";
	import { IShared } from "@/features/api/sharingData.types";

	// UI
	import { NSpin, NIcon } from "naive-ui";
	import { CheckSharp } from "@vicons/material";

	class ManageLoadError extends Error {
		constructor(
			public code: "EMPIRES" | "CX" | "PLANS" | "SHARING",
			message: string
		) {
			super(message);
			this.name = "ManageLoadError";
		}
	}

	const loading: Ref<boolean> = ref(true);
	const error: Ref<null | ManageLoadError> = ref(null);

	const loadingSteps: Ref<
		Record<string, { status: boolean; description: string }>
	> = ref({
		EMPIRES: {
			status: false,
			description: "Empire Information",
		},
		CX: {
			status: false,
			description: "CX Information",
		},
		PLANS: {
			status: false,
			description: "All Plan Information",
		},
		SHARING: {
			status: false,
			description: "Shared Plans",
		},
	});

	const emit = defineEmits<{
		(e: "update:empireList", value: IPlanEmpireElement[]): void;
		(e: "update:cxList", value: ICX[]): void;
		(e: "update:planList", value: IPlan[]): void;
		(e: "update:sharedList", value: IShared[]): void;
	}>();

	async function loadData() {
		loading.value = true;
		error.value = null;

		// load all empire data
		try {
			emit("update:empireList", await planningStore.getAllEmpires());
			loadingSteps.value.EMPIRES.status = true;
		} catch {
			error.value = new ManageLoadError(
				"EMPIRES",
				"Unable to Load Empires"
			);
		}
		// load all cx data
		try {
			emit("update:cxList", await planningStore.getAllCX());
			loadingSteps.value.CX.status = true;
		} catch {
			error.value = new ManageLoadError("CX", "Unable to Load CX");
		}
		// load all plan data
		try {
			emit("update:planList", await planningStore.getAllPlans());
			loadingSteps.value.PLANS.status = true;
		} catch {
			error.value = new ManageLoadError("PLANS", "Unable to Load Plans");
		}
		// load all shared data
		try {
			emit("update:sharedList", await planningStore.getSharedList());
			loadingSteps.value.SHARING.status = true;
		} catch {
			error.value = new ManageLoadError(
				"SHARING",
				"Unable to Load Sharing Information"
			);
		}

		if (error.value === null) {
			loading.value = false;
		}
	}

	onMounted(() => {
		loadData();
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
			">
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="bg-black p-8 rounded shadow-lg text-center">
					<template v-if="loading">
						<h1 class="text-2xl font-bold font-mono mb-3">
							Loading Data..
						</h1>
						<div
							v-for="(elem, index) in Object.values(loadingSteps)"
							:key="index"
							class="flex flex-row mb-2 align-middle">
							<div class="pr-5">
								<n-spin v-if="!elem.status" :size="20" />
								<n-icon v-else :size="20">
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
							Something unexpected happened. Check the Browser
							Console.
						</div>
					</template>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<Suspense>
			<slot />

			<template #fallback>
				<RenderingProgress />
			</template>
		</Suspense>
	</template>
</template>
