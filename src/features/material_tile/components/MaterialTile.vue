<script setup lang="ts">
	/*
		Allowing the drawer to render is quite the performance-hit
		due to many HTML elements being created.
	*/
	import { computed, ComputedRef, ref, Ref } from "vue";

	// Composables
	import { useMaterialData } from "@/features/game_data/useMaterialData";
	import { useExchangeData } from "@/features/game_data/useExchangeData";

	// Components
	import WrapperGameDataLoader from "@/features/wrapper/components/WrapperGameDataLoader.vue";
	import MaterialDataChart from "@/features/market_exploration/components/MaterialDataChart.vue";

	// UI
	import {
		NDrawer,
		NDrawerContent,
		NTable,
		NSelect,
		NTooltip,
	} from "naive-ui";

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
			default: undefined,
		},
		disableDrawer: {
			type: Boolean,
			required: false,
			default: true,
		},
		max: {
			type: Number,
			required: false,
			default: undefined,
		},
	});

	const { getMaterial } = useMaterialData();
	const { exchangeTypesArray, getMaterialExchangeOverview } =
		useExchangeData();

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

	const indicatorPercentage: ComputedRef<number> = computed(() => {
		if (props.amount && props.max) {
			return (props.amount / props.max) * 100;
		}
		return 0;
	});

	const indicatorStyle: ComputedRef<string> = computed(() => {
		const percentage: number = 100 - indicatorPercentage.value;

		let color: string = "";

		if (percentage > 75) {
			color = "rgb(255, 0, 0)";
		} else if (percentage > 50) {
			color = "rgb(255, 165, 0)";
		} else if (percentage > 25) {
			color = "rgb(255, 299, 71)";
		} else {
			color = "rgb(60, 179, 113)";
		}

		const style: string =
			"background: linear-gradient(transparent " +
			percentage.toFixed(4) +
			"%, " +
			color +
			" 0%);";

		return style;
	});
</script>

<template>
	<WrapperGameDataLoader
		load-materials
		load-exchanges
		minimal
		@complete="
			() => {
				if (!disableDrawer) {
					refExchangeOverview = getMaterialExchangeOverview(
						props.ticker
					);
				}
			}
		">
		<div class="inline-block">
			<div
				class="flex flex-row child:my-auto w-full"
				:class="
					!disableDrawer
						? `Material-${ticker} hover:cursor-pointer`
						: `Material-${ticker}`
				"
				@click="
					() => {
						if (!disableDrawer) {
							refShowDrawer = !refShowDrawer;
						}
					}
				">
				<div class="py-[1px] px-2 flex flex-row">
					<div v-if="amount" class="pr-1">
						{{ formatNumber(amount) }}x
					</div>
					<div class="font-bold text-nowrap">{{ ticker }}</div>
				</div>
				<template v-if="max">
					<n-tooltip>
						<template #trigger>
							<div
								class="!w-[7px] !my-0 border-white/50"
								:style="indicatorStyle">
								&nbsp;
							</div>
						</template>
						<n-table>
							<tbody>
								<tr>
									<th>Value</th>
									<td>{{ formatNumber(amount) }}</td>
								</tr>
								<tr>
									<th>Maximum</th>
									<td>{{ formatNumber(max) }}</td>
								</tr>
								<tr>
									<th>% / Max</th>
									<td>
										{{ formatNumber(indicatorPercentage) }}
										%
									</td>
								</tr>
							</tbody>
						</n-table>
					</n-tooltip>
				</template>
			</div>
		</div>

		<n-drawer
			v-if="refShowDrawer"
			v-model:show="refShowDrawer"
			:width="500"
			placement="right">
			<n-drawer-content title="Material Information">
				<div class="flex gap-x-5">
					<div class="flex items-center">
						<div
							:class="`Material-${ticker}`"
							class="text-nowrap p-2 px-4 text-2xl">
							{{ getMaterial(ticker).Ticker }}
						</div>
					</div>
					<div class="flex-grow">
						<div
							class="w-full grid grid-cols-[25%_auto] child:odd:font-bold">
							<div>Category</div>
							<div>
								{{
									capitalizeString(
										getMaterial(ticker).CategoryName
									)
								}}
							</div>
							<div>Weight</div>
							<div>
								{{
									formatNumber(getMaterial(ticker).Weight, 4)
								}}
								t
							</div>
							<div>Volume</div>
							<div>
								{{
									formatNumber(getMaterial(ticker).Volume, 4)
								}}
								m³
							</div>
						</div>
					</div>
				</div>
				<h3 class="font-bold text-lg py-5">Markets</h3>
				<n-table striped>
					<thead>
						<tr>
							<th />
							<th>AI1</th>
							<th>CI1</th>
							<th>IC1</th>
							<th>NC1</th>
						</tr>
					</thead>
					<tbody
						v-if="refExchangeOverview"
						class="child:child:first:font-bold">
						<tr>
							<td>Ask</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`Ask#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.Ask[cx],
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>Bid</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`Bid#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.Bid[cx],
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>Average</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`Average#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.Average[cx],
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>PP7D</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`PP7D#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.PP7D[cx],
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>PP30D</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`PP30D#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.PP30D[cx],
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>7D Universe</td>
							<td colspan="4" class="text-center">
								{{
									formatNumber(
										refExchangeOverview.Universe7D,
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>30D Universe</td>
							<td colspan="4" class="text-center">
								{{
									formatNumber(
										refExchangeOverview.Universe30D,
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>Supply</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`Supply#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.Supply[cx],
										2,
										true
									)
								}}
							</td>
						</tr>
						<tr>
							<td>Demand</td>
							<td
								v-for="cx in exchangeTypesArray"
								:key="`Demand#${cx}`">
								{{
									formatNumber(
										refExchangeOverview.Demand[cx],
										2,
										true
									)
								}}
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
							v-model:value="refChartValue"
							class="!w-[200px]"
							size="tiny"
							:options="refChartValueOptions" />
					</div>
				</div>

				<MaterialDataChart
					:material-ticker="ticker"
					:display-value="refChartValue" />
			</n-drawer-content>
		</n-drawer>
	</WrapperGameDataLoader>
</template>
