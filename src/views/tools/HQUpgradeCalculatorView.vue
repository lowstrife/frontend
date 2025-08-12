<script setup lang="ts">
	import { Ref, ref } from "vue";
	import { useHead } from "@unhead/vue";

	useHead({
		title: "HQ Upgrade Calculator | PRUNplanner",
	});

	// Composables
	import { useHQUpgradeCalculator } from "@/features/hq_upgrade_calculator/useHQUpgradeCalculator";

	// Components
	import WrapperGameDataLoader from "@/features/wrapper/components/WrapperGameDataLoader.vue";
	import WrapperPlanningDataLoader from "@/features/wrapper/components/WrapperPlanningDataLoader.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";
	import CXPreferenceSelector from "@/features/exchanges/components/CXPreferenceSelector.vue";
	import XITTransferActionButton from "@/features/xit/components/XITTransferActionButton.vue";
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Util
	import { formatNumber, formatAmount } from "@/util/numbers";

	// Types & Interfaces
	import { IFIOFindMaterialLocation } from "@/features/fio/useFIOStorage.types";

	// UI
	import {
		NForm,
		NFormItem,
		NInputNumber,
		NCheckbox,
		NSelect,
	} from "naive-ui";
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";

	const selectedStart: Ref<number> = ref(1);
	const selectedTo: Ref<number> = ref(3);
	const selectedOverride: Ref<Record<string, number | null>> = ref({});
	const selectedShowLocations: Ref<boolean> = ref(true);
	const refSelectedCXUuid: Ref<string | undefined> = ref(undefined);

	const {
		levelOptions,
		levelOptionsTo,
		materialData,
		totalCost,
		totalWeightVolume,
	} = useHQUpgradeCalculator(
		selectedStart,
		selectedTo,
		selectedOverride,
		refSelectedCXUuid
	);
</script>

<template>
	<WrapperGameDataLoader load-exchanges load-materials>
		<WrapperPlanningDataLoader
			load-c-x
			@update:cx-uuid="(d) => (refSelectedCXUuid = d)">
			<div class="min-h-screen flex flex-col">
				<div
					class="px-6 py-3 border-b border-white/10 flex flex-row justify-between gap-x-3">
					<h1 class="text-2xl font-bold my-auto">
						HQ Upgrade Calculator
					</h1>
					<HelpDrawer file-name="tools_hq_upgrade_calculator" />
				</div>
				<div
					class="border-b border-white/10 grid grid-cols-1 xl:grid-cols-2 divide-x divide-white/10">
					<div
						class="px-6 py-3 grid grid-cols-1 xl:grid-cols-2 gap-3">
						<div>
							<n-form
								size="small"
								label-placement="left"
								label-width="auto"
								label-align="left">
								<n-form-item label="From HQ Level">
									<n-select
										v-model:value="selectedStart"
										:options="levelOptions"
										filterable
										class="max-w-[150px]" />
								</n-form-item>
								<n-form-item label="To HQ Level">
									<n-select
										v-model:value="selectedTo"
										:options="levelOptionsTo"
										filterable
										class="max-w-[150px]" />
								</n-form-item>
							</n-form>
						</div>
						<div>
							<n-form
								size="small"
								label-placement="left"
								label-width="auto"
								label-align="left">
								<n-form-item label="CX Preference">
									<CXPreferenceSelector
										:cx-uuid="refSelectedCXUuid"
										@update:cxuuid="
											(value) =>
												(refSelectedCXUuid = value)
										" />
								</n-form-item>
								<n-form-item label="Show Locations">
									<n-checkbox
										v-model:checked="
											selectedShowLocations
										" />
								</n-form-item>
							</n-form>
						</div>
					</div>
					<div
						class="px-6 py-3 grid grid-cols-1 xl:grid-cols-2 gap-x-3">
						<div
							class="grid grid-cols-[min-content_1fr] gap-x-3 child:not-even:font-bold child:not-even:text-nowrap child:not-even:pr-3">
							<div>Total Cost</div>
							<div>
								{{ formatNumber(totalCost) }}
								<span class="pl-1 font-light text-white/50">
									$
								</span>
							</div>
							<div>Total Volume</div>
							<div>
								{{
									formatNumber(totalWeightVolume.totalVolume)
								}}
								<span class="pl-1 font-light text-white/50">
									m³
								</span>
							</div>
							<div>Total Weight</div>
							<div>
								{{
									formatNumber(totalWeightVolume.totalWeight)
								}}
								<span class="pl-1 font-light text-white/50">
									t
								</span>
							</div>
						</div>
						<div class="text-end">
							<XITTransferActionButton
								:elements="
									materialData
										.map((e) => ({
											ticker: e.ticker,
											value: e.required,
										}))
										.filter((f) => f.value > 0)
								" />
						</div>
					</div>
				</div>

				<div class="px-6 py-3">
					<XNDataTable :data="materialData" striped>
						<XNDataTableColumn
							key="ticker"
							title="Material"
							sorter="default">
							<template #render-cell="{ rowData }">
								<MaterialTile
									:ticker="rowData.ticker"
									:disable-drawer="false" />
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="amount"
							title="Amount"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatAmount(rowData.amount) }}
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="storage"
							title="Storage"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatAmount(rowData.storage) }}
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="override"
							title="Override Stock">
							<template #render-cell="{ rowData }">
								<n-input-number
									:key="`OVERRIDE#${rowData.ticker}`"
									v-model:value="
										selectedOverride[rowData.ticker]
									"
									:min="0"
									clearable
									show-button
									size="small"
									placeholder=""
									class="max-w-[150px]" />
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="required"
							title="Required"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatAmount(rowData.required) }}
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="unitCost"
							title="Cost / Unit"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatNumber(rowData.unitCost) }}
								<span class="pl-1 font-light text-white/50">
									$
								</span>
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="totalCost"
							title="Total Cost"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatNumber(rowData.totalCost) }}
								<span class="pl-1 font-light text-white/50">
									$
								</span>
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							v-if="selectedShowLocations"
							key="storageLocations"
							title="Storage Locations"
							:width="'25%'">
							<template #render-cell="{ rowData }">
								{{
									rowData.storageLocations
										.map(
											(e: IFIOFindMaterialLocation) =>
												`${e.amount}x @ ${e.name} (${e.type})`
										)
										.join(", ")
								}}
							</template>
						</XNDataTableColumn>
					</XNDataTable>
				</div>
			</div>
		</WrapperPlanningDataLoader>
	</WrapperGameDataLoader>
</template>
