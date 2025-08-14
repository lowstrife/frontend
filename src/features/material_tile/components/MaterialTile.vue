<script setup lang="ts">
	/*
		Allowing the drawer to render is quite the performance-hit
		due to many HTML elements being created.
	*/
	import { computed, ComputedRef, onMounted, ref, Ref } from "vue";

	// Composables
	import { useMaterialData } from "@/features/game_data/useMaterialData";
	import { useExchangeData } from "@/features/game_data/useExchangeData";

	// Components
	import MaterialDataChart from "@/features/market_exploration/components/MaterialDataChart.vue";
	import MaterialCXOverviewTable from "@/features/cx/components/MaterialCXOverviewTable.vue";

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
	import { IMaterial } from "@/features/api/gameData.types";
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
		enablePopover: {
			type: Boolean,
			required: false,
			default: true,
		},
	});

	const { getMaterial } = useMaterialData();
	const { getMaterialExchangeOverview } = useExchangeData();

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

	const material: ComputedRef<IMaterial> = computed(() => {
		return getMaterial(props.ticker);
	});

	const categoryCssClass: ComputedRef<string> = computed(() => {
		const sanitizedName = material.value.CategoryName
			.replaceAll(' ', '-')
			.replaceAll('(', '')
			.replaceAll(')', '');
		return `material-category-${sanitizedName}`;
	});

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

	onMounted(() => {
		try {
			refExchangeOverview.value = getMaterialExchangeOverview(
				props.ticker
			);
		} catch {
			refExchangeOverview.value = undefined;
		}
	});
</script>

<template>
	<div class="inline-block">
		<div
			class="flex flex-row child:my-auto w-full material-tile"
			:class="[
				categoryCssClass,
				{ 'hover:cursor-pointer': !disableDrawer || enablePopover }
			]"
			@click="
				() => {
					if (!disableDrawer) {
						refShowDrawer = !refShowDrawer;
					}
				}
			">
			<n-tooltip
				:disabled="
					refExchangeOverview === undefined || !enablePopover
						? true
						: false
				">
				<template #trigger>
					<div
						class="flex flex-row w-full justify-center"
						:class="{ 'px-2': !!amount }">
						<div v-if="amount" class="pr-1">
							{{ formatNumber(amount) }}x
						</div>
						<div class="font-bold text-nowrap">{{ ticker }}</div>
					</div>
				</template>
				<MaterialCXOverviewTable
					v-if="refExchangeOverview"
					:ticker="ticker"
					:overview-data="refExchangeOverview" />
			</n-tooltip>
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
							{{ capitalizeString(material.CategoryName) }}
						</div>
						<div>Weight</div>
						<div>
							{{ formatNumber(material.Weight, 4) }}
							t
						</div>
						<div>Volume</div>
						<div>
							{{ formatNumber(material.Volume, 4) }}
							m³
						</div>
					</div>
				</div>
			</div>
			<h3 class="font-bold text-lg py-5">Markets</h3>
			<MaterialCXOverviewTable
				v-if="refExchangeOverview"
				:ticker="ticker"
				:overview-data="refExchangeOverview" />

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
</template>
