import { ref } from "vue";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Composables
import { usePlanCalculation } from "@/features/planning/usePlanCalculation";

// test data
import plan_etherwind from "@/tests/test_data/api_data_plan_etherwind.json";
import planet_etherwind from "@/tests/test_data/api_data_planet_etherwind.json";
import recipes from "@/tests/test_data/api_data_recipes.json";
import buildings from "@/tests/test_data/api_data_buildings.json";
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";

const etherwindPlanetId: string = "KW-688c";

describe("usePlanCalculation", async () => {
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();

		gameDataStore.planets[etherwindPlanetId] = planet_etherwind;

		buildings.forEach((b) => {
			gameDataStore.buildings[b.Ticker] = b;
		});

		recipes.forEach((r) => {
			if (!gameDataStore.recipes[r.BuildingTicker]) {
				gameDataStore.recipes[r.BuildingTicker] = [];
			}

			gameDataStore.recipes[r.BuildingTicker].push(r);
		});

		materials.forEach((m) => {
			gameDataStore.materials[m.Ticker] = m;
		});

		exchanges.forEach((e) => {
			gameDataStore.exchanges[e.TickerId] = e;
		});

		vi.resetAllMocks();
	});

	it("validate result", async () => {
		const { result } = usePlanCalculation(
			// @ts-expect-error mock data
			ref(plan_etherwind),
			ref(undefined),
			ref(undefined),
			ref(undefined)
		);

		expect(result.value.corphq).toBeFalsy();
		expect(result.value.cogc).toBe("RESOURCE_EXTRACTION");
		expect(result.value.workforce.pioneer.required).toBe(2170);
		expect(result.value.materialio.length).toBe(18);

		// area
		expect(result.value.area).toStrictEqual({
			areaLeft: 6,
			areaTotal: 1000,
			areaUsed: 994,
			permits: 3,
		});
	});
});
