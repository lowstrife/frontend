<script setup lang="ts">
	import { PropType } from "vue";
	import { IEmpirePlanListData } from "../empire.types";

	// Composables
	import { usePlanetData } from "@/features/game_data/usePlanetData";
	const { getPlanetName } = usePlanetData();

	// Util
	import { formatNumber } from "@/util/numbers";
	import { capitalizeString } from "@/util/text";

	// UI
	import {
		XNDataTable,
		XNDataTableColumn,
		XNDataTableSummaryRow,
		XNDataTableSummaryCell,
	} from "@skit/x.naive-ui";

	defineProps({
		planListData: {
			type: Array as PropType<IEmpirePlanListData[]>,
			required: true,
		},
	});
</script>

<template>
	<x-n-data-table :data="planListData" striped>
		<x-n-data-table-column key="name" title="Plan" sorter="default">
			<template #render-cell="{ rowData }">
				<router-link
					:to="`/plan/${rowData.planet}/${rowData.uuid}`"
					class="text-link-primary font-bold hover:underline text-nowrap">
					{{ rowData.name }}
				</router-link>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="planet" title="Planet" sorter="default">
			<template #render-cell="{ rowData }">
				<div class="text-nowrap">
					{{ getPlanetName(rowData.planet) }}
				</div>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="cogc" title="COGC" sorter="default">
			<template #render-cell="{ rowData }">
				<div class="text-nowrap">
					{{ capitalizeString(rowData.cogc) }}
				</div>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="permits" title="Permits" sorter="default">
			<template #title>
				<div class="text-nowrap">Permits</div>
			</template>
			<template #render-cell="{ rowData }">
				<div class="text-center">{{ rowData.permits }}</div>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column key="profit" title="Profit" sorter="default">
			<template #render-cell="{ rowData }">
				<div class="text-nowrap text-end">
					<span
						:class="
							rowData.profit >= 0
								? 'text-positive'
								: 'text-negative'
						">
						{{ formatNumber(rowData.profit) }}
					</span>
					<span class="pl-1 font-light text-white/50">$</span>
				</div>
			</template>
		</x-n-data-table-column>
		<template #empty>
			<div class="text-center">No Plans in Empire.</div>
		</template>
		<template #summary>
			<x-n-data-table-summary-row>
				<x-n-data-table-summary-cell key="name" :col-span="5">
					<template #default>
						<strong class="text-white/80">
							Total permits planned:
							{{
								planListData.reduce(
									(sum, elem) => sum + elem.permits,
									0
								)
							}}
						</strong>
					</template>
				</x-n-data-table-summary-cell>
			</x-n-data-table-summary-row>
		</template>
	</x-n-data-table>
</template>
