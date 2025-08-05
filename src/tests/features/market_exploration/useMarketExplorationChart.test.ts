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

	describe("sanitizeData", () => {
		it("returns empty array when input is empty", () => {
			const { sanitizeData } = useMarketExplorationChart(
				exchangeTicker,
				materialTicker
			);
			expect(sanitizeData([])).toEqual([]);
		});

		it.each([
			{
				name: "volume_max is same as previous",
				input: [
					{
						volume_max: 100,
						price_first: 1,
						price_max: 1,
						price_min: 1,
						price_last: 1,
					} as IExploration,
					{
						volume_max: 100,
						price_first: 1,
						price_max: 1,
						price_min: 1,
						price_last: 1,
					} as IExploration,
				],
				expected: [
					{
						volume_max: 100,
						price_first: 1,
						price_max: 1,
						price_min: 1,
						price_last: 1,
					},
					{
						volume_max: 0,
						price_first: 1,
						price_max: 1,
						price_min: 1,
						price_last: 1,
					},
				],
			},
			{
				name: "price fields exceed 3x previous",
				input: [
					{
						volume_max: 100,
						price_first: 10,
						price_max: 10,
						price_min: 10,
						price_last: 10,
					} as IExploration,
					{
						volume_max: 200,
						price_first: 40,
						price_max: 50,
						price_min: 31,
						price_last: 35,
					} as IExploration,
				],
				expected: [
					{
						volume_max: 100,
						price_first: 10,
						price_max: 10,
						price_min: 10,
						price_last: 10,
					},
					{
						volume_max: 200,
						price_first: 30,
						price_max: 30,
						price_min: 30,
						price_last: 30,
					},
				],
			},
			{
				name: "price fields within acceptable range",
				input: [
					{
						volume_max: 100,
						price_first: 10,
						price_max: 10,
						price_min: 10,
						price_last: 10,
					} as IExploration,
					{
						volume_max: 200,
						price_first: 20,
						price_max: 25,
						price_min: 15,
						price_last: 18,
					} as IExploration,
				],
				expected: [
					{
						volume_max: 100,
						price_first: 10,
						price_max: 10,
						price_min: 10,
						price_last: 10,
					},
					{
						volume_max: 200,
						price_first: 20,
						price_max: 25,
						price_min: 15,
						price_last: 18,
					},
				],
			},
		])("$name", ({ input, expected }) => {
			const { sanitizeData } = useMarketExplorationChart(
				exchangeTicker,
				materialTicker
			);
			const result = sanitizeData([...input]);
			expect(result).toEqual(expected);
		});
	});
});
