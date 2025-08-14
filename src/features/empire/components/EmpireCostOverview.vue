<script setup lang="ts">
	import { PropType } from "vue";

	// Util
	import { formatNumber } from "@/util/numbers";

	// Types & Interfaces
	import { IEmpireCostOverview } from "@/features/empire/empire.types";

	defineProps({
		costOverview: {
			type: Object as PropType<IEmpireCostOverview>,
			required: true,
		},
	});
</script>

<template>
	<div class="grid grid-cols-1 2xl:grid-cols-3 gap-6 child:child:text-center">
		<div>
			<div class="text-white/40 text-xs">Profit</div>
			<div class="text-white text-xl">
				{{ formatNumber(costOverview.totalProfit) }}
			</div>
			<div class="text-white/40 text-xs">
				{{
					formatNumber(
						(costOverview.totalProfit / costOverview.totalRevenue) *
							100
					)
				}}
				%
			</div>
		</div>
		<div>
			<div class="text-white/40 text-xs">Revenue</div>
			<div class="text-white text-xl">
				{{ formatNumber(costOverview.totalRevenue) }}
			</div>
		</div>
		<div>
			<div class="text-white/40 text-xs">Cost</div>
			<div class="text-white text-xl">
				{{ formatNumber(costOverview.totalCost) }}
			</div>
			<div class="text-white/40 text-xs">
				{{
					formatNumber(
						(costOverview.totalCost / costOverview.totalRevenue) *
							100
					)
				}}
				%
			</div>
		</div>
	</div>
</template>
