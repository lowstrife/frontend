<script setup lang="ts">
	import { Ref, ref } from "vue";
	import { useHead } from "@unhead/vue";

	useHead({
		title: "Market Exploration | PRUNplanner",
	});

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";

	// Components
	import WrapperGameDataLoader from "@/features/wrapper/components/WrapperGameDataLoader.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";

	// Composables
	import { useMarketExplorationChart } from "@/features/market_exploration/useMarketExplorationChart";

	// Types & Interfaces
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// UI
	import { NSpin, NSelect, NButton } from "naive-ui";
	import { Chart } from "highcharts-vue";
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";
	import { formatDate } from "@/util/date";
	import { formatAmount } from "@/util/numbers";

	const gameDataStore = useGameDataStore();

	const exchangeOptions: Ref<SelectMixedOption[]> = ref(
		["AI1", "CI1", "CI2", "IC1", "NC1", "NC2"].map((e) => {
			return { label: e, value: e };
		})
	);

	const materialOptions: Ref<SelectMixedOption[]> = ref(
		gameDataStore.getMaterials().map((e) => {
			return { label: e.Ticker, value: e.Ticker };
		})
	);

	const selectedExchange: Ref<string> = ref("AI1");
	const selectedMaterial: Ref<string> = ref("RAT");

	const {
		fetchData,
		isLoading: loading,
		hasError: error,
		chartOptions,
		dataChart,
	} = useMarketExplorationChart(selectedExchange, selectedMaterial);
</script>

<template>
	<WrapperGameDataLoader
		:key="`GAMEDATAWRAPPER#MarketExploration`"
		load-materials>
		<div class="min-h-screen flex flex-col">
			<div
				class="px-6 py-3 border-b border-white/10 flex flex-row justify-between gap-x-3">
				<h1 class="text-2xl font-bold">Market Exploration</h1>
				<div>
					<div class="flex flex-row gap-x-3 child:my-auto">
						<div>Exchange</div>
						<n-select
							v-model:value="selectedExchange"
							size="small"
							:options="exchangeOptions"
							class="min-w-[100px]" />

						<div>Material</div>
						<n-select
							v-model:value="selectedMaterial"
							size="small"
							filterable
							:options="materialOptions"
							class="min-w-[100px]" />
						<n-button
							size="small"
							:loading="loading"
							@click="fetchData">
							Explore
						</n-button>
						<HelpDrawer file-name="tools_market_exploration" />
					</div>
				</div>
			</div>
			<div class="px-6 py-3">
				<div v-if="loading" class="text-center">
					<n-spin :size="30" /> <br />
					Loading Data
				</div>
				<div v-else-if="error" class="text-center">
					Error Loading Data
				</div>
				<div v-else-if="!loading && !error && dataChart.length > 0">
					<Chart
						ref="marketchart"
						:constructor-type="'stockChart'"
						class="hc"
						:options="chartOptions" />
					<h2 class="text-xl py-2">Data</h2>
					<XNDataTable
						:data="dataChart"
						striped
						:pagination="{ pageSize: 50 }">
						<XNDataTableColumn
							key="Datetime"
							title="Date"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatDate(rowData.Datetime) }}
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="price_average"
							title="Average Price"
							sorter="default" />
						<XNDataTableColumn
							key="price_min"
							title="Lowest Price"
							sorter="default" />
						<XNDataTableColumn
							key="price_max"
							title="Highest Price"
							sorter="default" />
						<XNDataTableColumn
							key="volume_max"
							title="Traded Volume"
							sorter="default">
							<template #render-cell="{ rowData }">
								{{ formatAmount(rowData.volume_max) }}
							</template>
						</XNDataTableColumn>
						<XNDataTableColumn
							key="delta_supply_demand"
							title="Delta Supply & Demand"
							sorter="default">
							<template #render-cell="{ rowData }">
								<span
									:class="
										rowData.delta_supply_demand >= 0
											? 'text-positive'
											: 'text-negative'
									">
									{{
										formatAmount(
											rowData.delta_supply_demand
										)
									}}
								</span>
							</template>
						</XNDataTableColumn>
					</XNDataTable>
				</div>
				<div v-else class="text-center">
					Please select an Exchange and Material. Press "Explore".
				</div>
			</div>
		</div>
	</WrapperGameDataLoader>
</template>
