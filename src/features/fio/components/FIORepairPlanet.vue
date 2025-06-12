<script setup lang="ts">
	import { PropType } from "vue";

	// Util
	import { relativeFromDate } from "@/util/date";
	import { formatAmount, formatNumber } from "@/util/numbers";

	// Types & Interfaces
	import { IFIOSitesRepairTablePlanetElement } from "@/features/fio/useFIORepair.types";

	// UI
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";

	const props = defineProps({
		repairData: {
			type: Array as PropType<IFIOSitesRepairTablePlanetElement[]>,
			required: true,
		},
	});
</script>

<template>
	<h2 class="text-white/80 font-bold text-lg pb-3">Planets</h2>

	<x-n-data-table :data="repairData" striped>
		<x-n-data-table-column
			title="Planet"
			key="planetName"
			sorter="default" />
		<x-n-data-table-column
			title="Production Buildings"
			key="amountProductionBuildings"
			sorter="default" />
		<x-n-data-table-column
			title="Average Condition"
			key="averageCondition"
			sorter="default">
			<template #render-cell="{ rowData }">
				{{ formatNumber(rowData.averageCondition * 100) }} %
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column
			title="Minimum Condition"
			key="minCondition"
			sorter="default">
			<template #render-cell="{ rowData }">
				{{ formatNumber(rowData.minCondition * 100) }} %
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column
			title="Longest Repair Age (days)"
			key="maxLastRepairDays"
			sorter="default">
			<template #render-cell="{ rowData }">
				{{ formatAmount(rowData.maxLastRepairDays) }}
			</template>
		</x-n-data-table-column>
	</x-n-data-table>
</template>
