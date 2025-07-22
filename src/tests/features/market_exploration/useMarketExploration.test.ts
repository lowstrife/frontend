import { describe, expect, it, vi } from "vitest";
import { apiService } from "@/lib/apiService";
import AxiosMockAdapter from "axios-mock-adapter";
import { useMarketExploration } from "@/features/market_exploration/useMarketExploration";

// test data
import exploration_7d_dw from "@/tests/test_data/api_data_exploration_7d_dw.json";
import { createPinia, setActivePinia } from "pinia";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("useMarketExploration", async () => {
	setActivePinia(createPinia());

	describe("getMaterialExplorationData", async () => {
		it("Call API 4 times and create structured result", async () => {
			const { getMaterialExplorationData } = useMarketExploration();

			const spyPostCalls = vi.spyOn(apiService, "post");

			mock.onPost("/data/market/AI1/DW").reply(200, exploration_7d_dw);
			mock.onPost("/data/market/CI1/DW").reply(200, exploration_7d_dw);
			mock.onPost("/data/market/IC1/DW").reply(200, exploration_7d_dw);
			mock.onPost("/data/market/NC1/DW").reply(200, exploration_7d_dw);

			const result = await getMaterialExplorationData("DW");

			expect(spyPostCalls).toBeCalledTimes(4);

			expect(result["AI1"]).toStrictEqual(exploration_7d_dw);
			expect(result["CI1"]).toStrictEqual(exploration_7d_dw);
			expect(result["IC1"]).toStrictEqual(exploration_7d_dw);
			expect(result["NC1"]).toStrictEqual(exploration_7d_dw);
		});
	});
});
