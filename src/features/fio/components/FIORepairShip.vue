<script setup lang="ts">
	import { PropType } from "vue";

	// Util
	import { formatNumber } from "@/util/numbers";

	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { IFIOSitesRepairTableShipElement } from "@/features/fio/useFIORepair.types";

	// UI
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";

	defineProps({
		repairData: {
			type: Array as PropType<IFIOSitesRepairTableShipElement[]>,
			required: true,
		},
	});
</script>

<template>
	<h2 class="text-white/80 font-bold text-lg pb-3">Ships</h2>

	<x-n-data-table :data="repairData" striped>
		<x-n-data-table-column
			key="shipRegistration"
			title="Id"
			sorter="default" />
		<x-n-data-table-column key="shipName" title="Name" sorter="default" />
		<x-n-data-table-column
			key="condition"
			title="Condition"
			sorter="default">
			<template #render-cell="{ rowData }">
				{{ formatNumber(rowData.condition * 100) }} %
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column
			key="repairMaterials"
			title="Repair Materials"
			sorter="default">
			<template #render-cell="{ rowData }">
				<div class="flex gap-x-1">
					<MaterialTile
						v-for="material in rowData.repairMaterials"
						:key="material.ticker"
						:ticker="material.ticker"
						:amount="material.amount" />
				</div>
			</template>
		</x-n-data-table-column>
	</x-n-data-table>
</template>
