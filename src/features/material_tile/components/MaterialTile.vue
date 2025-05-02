<template>
	<GameDataWrapper
		load-materials
		load-exchanges
		minimal
		v-on:success="
			() => {
				refExchangeOverview = getMaterialExchangeOverview(props.ticker);
			}
		"
	>
		<span
			:class="`Material-${ticker}`"
			class="p-1 px-2 hover:cursor-pointer child:my-auto"
			@click="
				() => {
					refShowDrawer = !refShowDrawer;
				}
			"
		>
			<span v-if="amount" class="pr-1">{{ amount }}x</span>
			<span class="font-bold">{{ ticker }}</span>
		</span>

		<n-drawer v-model:show="refShowDrawer" :width="500" placement="right">
			<n-drawer-content title="Material Information">
				<div class="flex gap-x-5">
					<div class="flex items-center">
						<div
							:class="`Material-${ticker}`"
							class="text-nowrap p-2 px-4 text-2xl"
						>
							{{ getMaterial(ticker).Ticker }}
						</div>
					</div>
					<div class="flex-grow">
						<div class="w-full grid grid-cols-[25%_auto] child:odd:font-bold">
							<div>Category</div>
							<div>
								{{ capitalizeString(getMaterial(ticker).CategoryName) }}
							</div>
							<div>Weight</div>
							<div>{{ formatNumber(getMaterial(ticker).Weight, 4) }} t</div>
							<div>Volume</div>
							<div>{{ formatNumber(getMaterial(ticker).Volume, 4) }} m³</div>
						</div>
					</div>
				</div>
				<h3 class="font-bold text-lg py-5">Markets</h3>
				<n-table striped>
					<thead>
						<tr>
							<th></th>
							<th>AI1</th>
							<th>CI1</th>
							<th>IC1</th>
							<th>NC1</th>
						</tr>
					</thead>
					<tbody class="child:child:first:font-bold" v-if="refExchangeOverview">
						<tr>
							<td>Ask</td>
							<td v-for="cx in exchangeTypesArray" :key="`Ask#${cx}`">
								{{ formatNumber(refExchangeOverview.Ask[cx], 2, true) }}
							</td>
						</tr>
						<tr>
							<td>Bid</td>
							<td v-for="cx in exchangeTypesArray" :key="`Bid#${cx}`">
								{{ formatNumber(refExchangeOverview.Bid[cx], 2, true) }}
							</td>
						</tr>
						<tr>
							<td>Average</td>
							<td v-for="cx in exchangeTypesArray" :key="`Average#${cx}`">
								{{ formatNumber(refExchangeOverview.Average[cx], 2, true) }}
							</td>
						</tr>
						<tr>
							<td>PP7D</td>
							<td v-for="cx in exchangeTypesArray" :key="`PP7D#${cx}`">
								{{ formatNumber(refExchangeOverview.PP7D[cx], 2, true) }}
							</td>
						</tr>
						<tr>
							<td>PP30D</td>
							<td v-for="cx in exchangeTypesArray" :key="`PP30D#${cx}`">
								{{ formatNumber(refExchangeOverview.PP30D[cx], 2, true) }}
							</td>
						</tr>
						<tr>
							<td>7D Universe</td>
							<td colspan="4" class="text-center">
								{{ formatNumber(refExchangeOverview.Universe7D, 2, true) }}
							</td>
						</tr>
						<tr>
							<td>30D Universe</td>
							<td colspan="4" class="text-center">
								{{ formatNumber(refExchangeOverview.Universe30D, 2, true) }}
							</td>
						</tr>
						<tr>
							<td>Supply</td>
							<td v-for="cx in exchangeTypesArray" :key="`Supply#${cx}`">
								{{ formatNumber(refExchangeOverview.Supply[cx], 2, true) }}
							</td>
						</tr>
						<tr>
							<td>Demand</td>
							<td v-for="cx in exchangeTypesArray" :key="`Demand#${cx}`">
								{{ formatNumber(refExchangeOverview.Demand[cx], 2, true) }}
							</td>
						</tr>
					</tbody>
				</n-table>

				<div class="flex py-5">
					<div class="my-auto grow">
						<h3 class="font-bold text-lg">Market History</h3>
					</div>
					<div>
						<n-select
							class="!w-[200px]"
							size="tiny"
							v-model:value="refChartValue"
							:options="refChartValueOptions"
						/>
					</div>
				</div>

				<MaterialDataChart
					:material-ticker="ticker"
					:display-value="refChartValue"
				/>
			</n-drawer-content>
		</n-drawer>
	</GameDataWrapper>
</template>

<script setup lang="ts">
	import { ref, Ref } from "vue";

	// Composables
	import { useMaterialData } from "@/features/game_data/useMaterialData";
	import { useExchangeData } from "@/features/game_data/useExchangeData";

	// Components
	import GameDataWrapper from "@/features/game_data/components/GameDataWrapper.vue";
	import MaterialDataChart from "@/features/market_exploration/components/MaterialDataChart.vue";

	// UI
	import { NDrawer, NDrawerContent, NTable, NSelect } from "naive-ui";

	// Util
	import { formatNumber } from "@/util/numbers";
	import { capitalizeString } from "@/util/text";

	// Interfaces & Types
	import { IMaterialExchangeOverview } from "@/features/game_data/useMaterialData.types";
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// Props
	const props = defineProps({
		ticker: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: false,
		},
	});

	const { getMaterial } = useMaterialData();
	const { exchangeTypesArray, getMaterialExchangeOverview } = useExchangeData();

	const refShowDrawer: Ref<boolean> = ref(false);
	const refExchangeOverview: Ref<IMaterialExchangeOverview | undefined> =
		ref(undefined);

	const refChartValue: Ref<string> = ref("volume_max");
	const refChartValueOptions: Ref<SelectMixedOption[]> = ref([
		{
			label: "Traded Volume",
			value: "volume_max",
		},
		{
			label: "Average Price",
			value: "price_average",
		},
		{
			label: "Daily Minimum Price",
			value: "price_min",
		},
		{
			label: "Daily Maximum Price",
			value: "price_max",
		},
	]);
</script>
