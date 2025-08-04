import { describe, expect, it, vi } from "vitest";
import { apiService } from "@/lib/apiService";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";

// test data
import exploration_7d_dw from "@/tests/test_data/api_data_exploration_7d_dw.json";
import { ref, Ref } from "vue";
import { useMarketExplorationChart } from "@/features/market_exploration/useMarketExplorationChart";
import { IExploration } from "@/features/market_exploration/marketExploration.types";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("useMarketExplorationChart", async () => {
	setActivePinia(createPinia());

	const exchangeTicker: Ref<string> = ref("DW");
	const materialTicker: Ref<string> = ref("NC1");

	it("initial status", async () => {
		const { isLoading, hasError, dataChart } = useMarketExplorationChart(
			exchangeTicker,
			materialTicker
		);

		expect(isLoading.value).toBeFalsy();
		expect(hasError.value).toBeFalsy();
		expect(dataChart.value).toStrictEqual([]);
	});

	it("fetch data with error and check error flag", async () => {
		const { fetchData, hasError, dataChart } = useMarketExplorationChart(
			exchangeTicker,
			materialTicker
		);
		mock.onPost("/data/market/DW/NC1").reply(500);

		await fetchData();

		expect(dataChart.value.length).toBe(0);
		expect(hasError.value).toBeTruthy();
	});

	it("fetch data and check it", async () => {
		const {
			fetchData,
			hasError,
			dataChart,
			dataCandlestick,
			dataVolume,
			dataDelta,
			chartOptions,
		} = useMarketExplorationChart(exchangeTicker, materialTicker);
		mock.onPost("/data/market/DW/NC1").reply(200, exploration_7d_dw);

		await fetchData();

		expect(dataChart.value.length).toBe(29);
		expect(hasError.value).toBeFalsy();
		expect(dataCandlestick.value.length).toBe(29);
		expect(dataVolume.value.length).toBe(29);
		expect(dataDelta.value.length).toBe(29);

		// @ts-expect-error access data directly thats not exposed
		expect(chartOptions.value.series[0].data.length).toBe(29);

		expect(dataCandlestick.value[0].length).toBe(5);
		expect(dataVolume.value[0].length).toBe(2);
		expect(dataDelta.value[0].length).toBe(2);
	});

	it("skipSameTrades", async () => {
		const testData: IExploration[] = [
			{
				Datetime: "2025-04-01",
				ExchangeCode: "NC1",
				Ticker: "DW",
				price_first: 101.0,
				price_last: 103.0,
				price_average: 102.02,
				price_min: 101.0,
				price_max: 103.0,
				volume_max: 100,
				demand_average: 412121.83,
				supply_average: 713185.9,
				delta_supply_demand: 301064.0,
			},
			{
				Datetime: "2025-04-01",
				ExchangeCode: "NC1",
				Ticker: "DW",
				price_first: 101.0,
				price_last: 103.0,
				price_average: 102.02,
				price_min: 101.0,
				price_max: 103.0,
				volume_max: 100,
				demand_average: 412121.83,
				supply_average: 713185.9,
				delta_supply_demand: 301064.0,
			},
			{
				Datetime: "2025-04-01",
				ExchangeCode: "NC1",
				Ticker: "DW",
				price_first: 101.0,
				price_last: 103.0,
				price_average: 102.02,
				price_min: 101.0,
				price_max: 103.0,
				volume_max: 20,
				demand_average: 412121.83,
				supply_average: 713185.9,
				delta_supply_demand: 301064.0,
			},
		];
		const { skipSameTrades } = useMarketExplorationChart(
			exchangeTicker,
			materialTicker
		);
		const result = skipSameTrades(testData);

		expect(result[0].volume_max).toBe(100);
		expect(result[1].volume_max).toBe(0);
		expect(result[2].volume_max).toBe(20);
	});
});
