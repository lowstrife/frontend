<script setup lang="ts">
	import { ref, Ref } from "vue";
	import { useHead } from "@unhead/vue";

	useHead({
		title: "Resource ROI Overview | PRUNplanner",
	});

	// Composables
	import { useResourceROIOverview } from "@/features/resource_roi_overview/useResourceROIOverview";

	// Components
	import WrapperGameDataLoader from "@/features/wrapper/components/WrapperGameDataLoader.vue";
	import WrapperPlanningDataLoader from "@/features/wrapper/components/WrapperPlanningDataLoader.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";
	import CXPreferenceSelector from "@/features/exchanges/components/CXPreferenceSelector.vue";
	import ResourceROITable from "@/features/resource_roi_overview/components/ResourceROITable.vue";

	// Statics
	import { PLANETSEARCHOPTIONMATERIALS } from "@/features/planet_search/searchConstants";

	// UI
	import { NForm, NFormItem, NSelect, NButton, NSpin } from "naive-ui";

	const refInitialized: Ref<boolean> = ref(false);
	const refSelectedCXUuid: Ref<string | undefined> = ref(undefined);
	const refSearchMaterial: Ref<string | undefined> = ref(undefined);
	const refIsLoading: Ref<boolean> = ref(false);

	const { resultData, calculate } = useResourceROIOverview(refSelectedCXUuid);

	async function performSearchAndCalculation(): Promise<void> {
		if (refSearchMaterial.value) {
			refInitialized.value = true;
			refIsLoading.value = true;
			calculate(refSearchMaterial.value).finally(
				() => (refIsLoading.value = false)
			);
		}
	}
</script>

<template>
	<WrapperGameDataLoader
		load-exchanges
		load-materials
		load-buildings
		load-recipes>
		<WrapperPlanningDataLoader
			load-c-x
			@update:cx-uuid="(d) => (refSelectedCXUuid = d)">
			<div class="min-h-screen flex flex-col">
				<div
					class="px-6 py-3 border-b border-white/10 flex flex-row justify-between">
					<h1 class="text-2xl font-bold my-auto">
						Resource ROI Overview
					</h1>
					<div>
						<n-form
							inline
							size="small"
							label-placement="left"
							label-width="auto"
							label-align="left">
							<n-form-item label="Select Resource">
								<n-select
									v-model:value="refSearchMaterial"
									:options="PLANETSEARCHOPTIONMATERIALS"
									placeholder=""
									filterable
									size="small"
									class="max-w-[100px]" />
							</n-form-item>
							<n-form-item label="CX Preference">
								<CXPreferenceSelector
									:cx-uuid="refSelectedCXUuid"
									@update:cxuuid="
										(value) => (refSelectedCXUuid = value)
									" />
							</n-form-item>
							<n-form-item>
								<n-button
									:disabled="!refSearchMaterial"
									:loading="refIsLoading"
									@click="performSearchAndCalculation">
									Search & Calculate
								</n-button>
							</n-form-item>
							<n-form-item>
								<HelpDrawer
									file-name="tools_resource_roi_overview" />
							</n-form-item>
						</n-form>
					</div>
				</div>

				<div class="px-6 py-3">
					<div v-if="!refInitialized">Select a Resource</div>
					<div v-else-if="refIsLoading" class="text-center py-3">
						<n-spin />
						<div>Getting Planets and Calculating Resource ROI</div>
					</div>
					<div v-else>
						<ResourceROITable
							v-if="refSearchMaterial"
							:searched-material="refSearchMaterial"
							:result-data="resultData" />
					</div>
				</div>
			</div>
		</WrapperPlanningDataLoader>
	</WrapperGameDataLoader>
</template>
