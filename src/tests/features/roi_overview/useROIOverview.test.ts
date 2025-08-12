import { ref } from "vue";
import { beforeAll, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// stores
import { useGameDataStore } from "@/stores/gameDataStore";

import { optimalProduction } from "@/features/roi_overview/assets/optimalProduction";

// test data
import recipes from "@/tests/test_data/api_data_recipes.json";
import buildings from "@/tests/test_data/api_data_buildings.json";
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";
import plan_etherwind from "@/tests/test_data/api_data_plan_etherwind.json";
import planet_etherwind from "@/tests/test_data/api_data_planet_etherwind.json";
import { useROIOverview } from "@/features/roi_overview/useROIOverview";

describe("useROIOverview", async () => {
	const definition = ref(plan_etherwind);
	const tnp = optimalProduction.find((e) => e.ticker === "TNP")!;

	beforeAll(() => {
		setActivePinia(createPinia());
		const gameDataStore = useGameDataStore();

		gameDataStore.setMaterials(materials);
		gameDataStore.setExchanges(exchanges);
		gameDataStore.setRecipes(recipes);
		// @ts-expect-error mock data
		gameDataStore.setBuildings(buildings);
		// @ts-expect-error mock data
		gameDataStore.setPlanet(planet_etherwind);
	});

	it("calculateItem", async () => {
		const { calculateItem, resultData } = useROIOverview(
			// @ts-expect-error mock definition
			definition,
			ref(undefined)
		);

		await calculateItem(tnp);

		expect(resultData.value.length).toBe(3);
	});

	it("calculate", async () => {
		const { calculate, resultData } = useROIOverview(
			// @ts-expect-error mock definition
			definition,
			ref(undefined)
		);

		await calculate();

		expect(resultData.value.length).toBe(353);
	});

	it("formatOptimal", async () => {
		const { formatOptimal } = useROIOverview(
			// @ts-expect-error mock definition
			definition,
			ref(undefined)
		);

		expect(formatOptimal(optimalProduction[0])).toBe(
			"35x RIG, 11x HB1, 1x STO"
		);
		expect(formatOptimal(optimalProduction[1])).toBe(
			"11x TNP, 9x HB3, 1x STO"
		);
	});
});
