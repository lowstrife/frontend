import { setActivePinia, createPinia } from "pinia";
import { beforeAll, describe, expect, it } from "vitest";

import { useGameDataStore } from "@/stores/gameDataStore";

// test data
import exchanges from "@/tests/features/game_data/test_data/api_data_exchanges.json";
import { useExchangeData } from "@/features/game_data/useExchangeData";

describe("useExchangeData", () => {
	describe("getExchangeTicker", () => {
		let gameDataStore: any;

		beforeAll(() => {
			setActivePinia(createPinia());
			gameDataStore = useGameDataStore();
		});

		it("getExchangeTicker: existing", () => {
			const { getExchangeTicker } = useExchangeData();
			const testExchange = exchanges[0];

			gameDataStore.exchanges["foo"] = testExchange;

			const result = getExchangeTicker("foo");

			expect(result.TickerId).toBe(testExchange.TickerId);
		});

		it("getExchangeTicker: undefined", () => {
			const { getExchangeTicker } = useExchangeData();
			expect(() => getExchangeTicker("moo")).toThrowError();
		});
	});

	describe("getMaterialExchangeOverview", () => {
		let gameDataStore: any;

		beforeAll(() => {
			setActivePinia(createPinia());
			gameDataStore = useGameDataStore();
		});

		it("valid overview result", () => {
			const { getMaterialExchangeOverview } = useExchangeData();
			exchanges.forEach((e) => {
				gameDataStore.exchanges[e.TickerId] = e;
			});

			const result = getMaterialExchangeOverview("CL");

			expect(result.Ask).toBeDefined();
			expect(result.Average).toBeDefined();
			expect(result.Bid).toBeDefined();
			expect(result.Demand).toBeDefined();
			expect(result.PP30D).toBeDefined();
			expect(result.PP7D).toBeDefined();
			expect(result.Supply).toBeDefined();
			expect(result.Ask).toStrictEqual({
				AI1: 3490,
				CI1: 4350,
				IC1: 4900,
				NC1: 3890,
			});
			expect(result.Universe30D).toEqual(4042.1691183178923);
			expect(result.Universe7D).toEqual(3741.6387937743198);
		});
	});
});
