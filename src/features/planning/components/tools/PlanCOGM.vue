<script setup lang="ts">
	import { ComputedRef, computed, PropType } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	// Types & Interfaces
	import { IProductionBuildingRecipeCOGM } from "@/features/planning/usePlanCalculation.types";

	// Util
	import { humanizeTimeMs } from "@/util/date";
	import { formatNumber } from "@/util/numbers";

	// UI
	import { NTable } from "naive-ui";

	const props = defineProps({
		cogmData: {
			type: Object as PropType<IProductionBuildingRecipeCOGM>,
			required: true,
		},
	});

	const data: ComputedRef<IProductionBuildingRecipeCOGM> = computed(
		() => props.cogmData
	);
</script>

<template>
	<div class="pb-2 text-white/50 text-xs">
		The cost of goods manufactured is calculated using plan settings that
		factor in production efficiency, recipe runtime, building degradation,
		input material costs, labor requirements, and associated labor costs.
		The final cost is shown per unit of output, based on quantity or full
		cost allocation.
	</div>
	<n-table>
		<tbody>
			<tr>
				<th colspan="4">Parameters</th>
			</tr>
			<tr>
				<td class="!border-r">Recipe Runtime</td>
				<td>{{ humanizeTimeMs(data.runtime) }}</td>
				<td colspan="2" class="text-end">
					{{ formatNumber(data.runtimeShare * 100) }} % / day
				</td>
			</tr>
			<tr>
				<td class="!border-r">Efficiency</td>
				<td colspan="3">{{ formatNumber(data.efficiency * 100) }} %</td>
			</tr>
			<tr>
				<th colspan="4">Cost</th>
			</tr>
			<tr>
				<td class="!border-r">Degradation</td>
				<td class="font-bold">
					{{ formatNumber(data.degradationShare) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
				<td colspan="2" class="text-end">
					{{ formatNumber(data.runtimeShare * 100) }} % /
					{{ formatNumber(data.degradation) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
			</tr>
			<template v-if="data.inputCost.length > 0">
				<tr>
					<td :rowspan="data.inputCost.length + 2" class="!border-r">
						Materials
					</td>
					<td>Input Total</td>
					<td colspan="2" class="text-end font-bold">
						{{ formatNumber(data.inputTotal) }}
						<span class="pl-1 font-light text-white/50"> $ </span>
					</td>
				</tr>
				<tr>
					<td>Material</td>
					<td>$ / Unit</td>
					<td class="text-end">$ Total</td>
				</tr>
				<tr
					v-for="input in data.inputCost"
					:key="`INPUT#${input.ticker}`">
					<td>
						<MaterialTile
							:ticker="input.ticker"
							:amount="input.amount" />
					</td>
					<td>
						{{ formatNumber(input.costUnit) }}
						<span class="pl-1 font-light text-white/50"> $ </span>
					</td>
					<td class="text-end">
						{{ formatNumber(input.costTotal) }}
						<span class="pl-1 font-light text-white/50"> $ </span>
					</td>
				</tr>
			</template>
			<tr>
				<td class="!border-r">Workforce</td>
				<td class="font-bold">
					{{ formatNumber(data.workforceCost) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
				<td colspan="2" class="text-end">
					{{ formatNumber(data.runtimeShare * 100) }} % /
					{{ formatNumber(data.workforceCostTotal) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
			</tr>
			<tr class="child:!border-t-2">
				<td class="!border-r">Total Cost</td>
				<td colspan="3" class="font-bold">
					{{ formatNumber(data.totalCost) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
			</tr>
			<tr class="child:!border-b-2">
				<td class="!border-r">Recipe Profit</td>
				<td colspan="3" class="font-bold">
					{{ formatNumber(data.totalProfit) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
			</tr>
			<tr>
				<th colspan="4">Cost of Goods Manufactured</th>
			</tr>
			<tr>
				<td
					:rowspan="data.outputCOGM.length + 1"
					class="!border-b-0 !border-r">
					COGM
				</td>
				<td>Material</td>
				<td>Cost Split</td>
				<td class="text-end">Cost Total</td>
			</tr>
			<tr
				v-for="output in data.outputCOGM"
				:key="`OUTPUT#${output.ticker}`">
				<td>
					<MaterialTile
						:ticker="output.ticker"
						:amount="output.amount" />
				</td>
				<td>
					{{ formatNumber(output.costSplit) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
				<td class="text-end">
					{{ formatNumber(output.costTotal) }}
					<span class="pl-1 font-light text-white/50"> $ </span>
				</td>
			</tr>
		</tbody>
	</n-table>
</template>
