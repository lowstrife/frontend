import { setActivePinia, createPinia } from "pinia";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { useGameDataStore } from "@/stores/gameDataStore";
import { useBuildingData } from "@/features/game_data/useBuildingData";
import {
	IBuilding,
	IPlanetResource,
} from "@/features/game_data/gameData.types";

// test data
import building_single_tnp from "@/tests/features/game_data/test_data/api_data_building_single_tnp.json";
import building_single_hbl from "@/tests/features/game_data/test_data/api_data_building_single_hbl.json";

describe("useBuildingData", async () => {
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();
	});

	beforeEach(() => {
		gameDataStore.buildings = {};
	});

	it("getTotalWorkforce", async () => {
		gameDataStore.buildings["TNP"] = building_single_tnp;

		const TNP: IBuilding = gameDataStore.buildings["TNP"];

		const { getTotalWorkforce } = useBuildingData();

		expect(TNP).toBeDefined();
		expect(getTotalWorkforce(TNP)).toBe(80);
	});

	describe("getBuilding", async () => {
		it("Get valid building", async () => {
			gameDataStore.buildings["TNP"] = building_single_tnp;
			const { getBuilding } = useBuildingData();

			expect(getBuilding("TNP")).toStrictEqual(gameDataStore.buildings["TNP"]);
		});

		it("Get invalid, non-existing building", async () => {
			const { getBuilding } = useBuildingData();

			expect(() => getBuilding("FOO")).toThrowError();
		});
	});

	describe("getProductionBuildingOptions", async () => {
		it("Available production building", async () => {
			gameDataStore.buildings["TNP"] = building_single_tnp;
			const { getProductionBuildingOptions } = useBuildingData();

			const result = getProductionBuildingOptions();

			expect(result.length).toBe(1);
			expect(result[0].value).toBe("TNP");
			expect(result[0].label).toBe("TNP (Technetium Processing)");
		});

		it("Skip non-production building", async () => {
			gameDataStore.buildings["HBL"] = building_single_hbl;
			const { getProductionBuildingOptions } = useBuildingData();

			const result = getProductionBuildingOptions();

			expect(result.length).toBe(0);
		});

		it("Available production building matching COGC", async () => {
			gameDataStore.buildings["TNP"] = building_single_tnp;
			const { getProductionBuildingOptions } = useBuildingData();

			const result = getProductionBuildingOptions([], "CHEMISTRY");

			expect(result.length).toBe(1);
			expect(result[0].value).toBe("TNP");
			expect(result[0].label).toBe("TNP (Technetium Processing)");
		});

		it("Available production building not matching COGC", async () => {
			gameDataStore.buildings["TNP"] = building_single_tnp;
			const { getProductionBuildingOptions } = useBuildingData();

			const result = getProductionBuildingOptions([], "AGRICULTURE");

			expect(result.length).toBe(0);
		});
	});

	describe("getBuildingRecipes", async () => {
		it("Resource Building, no planet resource", async () => {
			const { getBuildingRecipes } = useBuildingData();

			const result = getBuildingRecipes("EXT");
			expect(result.length).toBe(0);
		});

		it("Resource Building, planet resources", async () => {
			const { getBuildingRecipes } = useBuildingData();

			const fakePlanetResources: IPlanetResource[] = [
				{
					MaterialId: "foo",
					ResourceType: "GASEOUS",
					Factor: 1,
					DailyExtraction: 3,
					MaterialTicker: "O",
					ExtractionMax: 3,
				},
			];

			const result = getBuildingRecipes("COL", fakePlanetResources);
			expect(result.length).toBe(1);
			expect(result[0].BuildingTicker).toBe("COL");
			expect(result[0].RecipeId).toBe("COL#O");
		});

		it("Production Building, error", async () => {
			const { getBuildingRecipes } = useBuildingData();
			expect(() => getBuildingRecipes("PP1")).toThrowError();
		});

		it("Production Building, with recipe", async () => {
			const { getBuildingRecipes } = useBuildingData();
			const fakeRecipe = {
				RecipeId: "PP1#150xPE=>1xBDE",
				BuildingTicker: "PP1",
				RecipeName: "150xPE=>1xBDE",
				TimeMs: 25920000,
				Inputs: [
					{
						Ticker: "PE",
						Amount: 150,
					},
				],
				Outputs: [
					{
						Ticker: "BDE",
						Amount: 1,
					},
				],
			};

			gameDataStore.recipes[fakeRecipe.BuildingTicker] = [fakeRecipe];

			const result = getBuildingRecipes(fakeRecipe.BuildingTicker);

			expect(result.length).toBe(1);
			expect(result[0].BuildingTicker).toBe(fakeRecipe.BuildingTicker);
		});
	});
});
