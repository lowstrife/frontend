import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// test data
import recipes from "@/tests/features/game_data/test_data/api_data_recipes.json";
import buildings from "@/tests/features/game_data/test_data/api_data_buildings.json";
import materials from "@/tests/features/game_data/test_data/api_data_materials.json";
import exchanges from "@/tests/features/game_data/test_data/api_data_exchanges.json";
import planets from "@/tests/features/game_data/test_data/api_data_planets.json";
import planet_single from "@/tests/features/game_data/test_data/api_data_planet_single.json";

// mocks
vi.mock("@/features/game_data/gameData", async () => {
	return {
		...(await vi.importActual("@/features/game_data/gameData")),
		callDataMaterials: vi.fn(),
		callDataExchanges: vi.fn(),
		callDataRecipes: vi.fn(),
		callDataBuildings: vi.fn(),
		callDataPlanet: vi.fn(),
		callDataMultiplePlanets: vi.fn(),
	};
});

vi.mock("@/lib/config", async () => {
	const original: any = await vi.importActual("@/lib/config");
	return {
		...original,
		default: {
			...original.default,
			GAME_DATA_STALE_MINUTES_BUILDINGS: 30,
			GAME_DATA_STALE_MINUTES_RECIPES: 30,
			GAME_DATA_STALE_MINUTES_MATERIALS: 30,
			GAME_DATA_STALE_MINUTES_EXCHANGES: 30,
			GAME_DATA_STALE_MINUTES_PLANETS: 30,
		},
	};
});

import {
	callDataMaterials,
	callDataExchanges,
	callDataRecipes,
	callDataBuildings,
	callDataPlanet,
	callDataMultiplePlanets,
} from "@/features/game_data/gameData";

// stores

import { useGameDataStore } from "@/stores/gameDataStore";
import { useUserStore } from "@/stores/userStore";

describe("GameData Store", async () => {
	let gameDataStore: any;

	beforeEach(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();

		vi.resetAllMocks();
	});

	describe("Prevent parallel refreshes", async () => {
		it("Materials singular refresh", async () => {
			vi.mocked(callDataMaterials).mockResolvedValueOnce(materials);

			gameDataStore.$state.isRefreshingMaterials = true;
			gameDataStore.$state.promiseRefreshingMaterials = Promise.resolve(true);

			const result = await gameDataStore.performLoadMaterials();

			expect(result).toBe(null);
			expect(callDataMaterials).not.toHaveBeenCalled();
		});

		it("Buildings singular refresh", async () => {
			// @ts-expect-error mock
			vi.mocked(callDataBuildings).mockResolvedValueOnce(buildings);

			gameDataStore.$state.isRefreshingBuildings = true;
			gameDataStore.$state.promiseRefreshingBuildings = Promise.resolve(true);

			const result = await gameDataStore.performLoadBuildings();

			expect(result).toBe(null);
			expect(callDataBuildings).not.toHaveBeenCalled();
		});

		it("Exchanges singular refresh", async () => {
			vi.mocked(callDataExchanges).mockResolvedValueOnce(exchanges);

			gameDataStore.$state.isRefreshingExchanges = true;
			gameDataStore.$state.promiseRefreshingExchanges = Promise.resolve(true);

			const result = await gameDataStore.performLoadExchanges();

			expect(result).toBe(null);
			expect(callDataExchanges).not.toHaveBeenCalled();
		});

		it("Recipes singular refresh", async () => {
			vi.mocked(callDataRecipes).mockResolvedValueOnce(recipes);

			gameDataStore.$state.isRefreshingRecipes = true;
			gameDataStore.$state.promiseRefreshingRecipes = Promise.resolve(true);

			const result = await gameDataStore.performLoadRecipes();

			expect(result).toBe(null);
			expect(callDataRecipes).not.toHaveBeenCalled();
		});
	});

	describe("Functions", () => {
		it("hasPlanet", () => {
			expect(
				gameDataStore.hasPlanet(planet_single.PlanetNaturalId)
			).toBeFalsy();

			// add single
			gameDataStore.planets[planet_single.PlanetNaturalId] = planet_single;

			expect(
				gameDataStore.hasPlanet(planet_single.PlanetNaturalId)
			).toBeTruthy();
			expect(gameDataStore.hasPlanet("foo")).toBeFalsy();
		});

		it("hasMultiplePlanets", () => {
			// comprehend planet list
			const ids: string[] = planets.map((p) => p.PlanetNaturalId);

			expect(gameDataStore.hasMultiplePlanets(ids)).toBeFalsy();

			// add all
			planets.forEach(
				(planet) => (gameDataStore.planets[planet.PlanetNaturalId] = planet)
			);

			expect(gameDataStore.hasMultiplePlanets(ids)).toBeTruthy();
		});
	});

	describe("Data Loader", async () => {
		it("performLoadMaterials: success", async () => {
			gameDataStore.materials[materials[0].Ticker] = materials[0];

			vi.mocked(callDataMaterials).mockResolvedValueOnce(materials);

			const result = await gameDataStore.performLoadMaterials();

			expect(result).toBeTruthy();
			expect(Object.keys(gameDataStore.materials).length).toBe(
				materials.length
			);

			materials.forEach((m) => {
				expect(gameDataStore.materials[m.Ticker]).toStrictEqual(m);
			});
		});

		it("performLoadMaterials: failure", async () => {
			vi.mocked(callDataMaterials).mockRejectedValueOnce(new Error());

			const result = await gameDataStore.performLoadMaterials();
			expect(result).toBeFalsy();
		});

		it("performLoadExchanges: success", async () => {
			gameDataStore.exchanges[exchanges[0].TickerId] = exchanges[0];

			vi.mocked(callDataExchanges).mockResolvedValueOnce(exchanges);

			const result = await gameDataStore.performLoadExchanges();

			expect(result).toBeTruthy();
			expect(Object.keys(gameDataStore.exchanges).length).toBe(
				exchanges.length
			);

			exchanges.forEach((e) => {
				expect(gameDataStore.exchanges[e.TickerId]).toStrictEqual(e);
			});
		});

		it("performLoadExchanges: failure", async () => {
			vi.mocked(callDataExchanges).mockRejectedValueOnce(new Error());

			const result = await gameDataStore.performLoadExchanges();
			expect(result).toBeFalsy();
		});

		it("performLoadRecipes: success", async () => {
			vi.mocked(callDataRecipes).mockResolvedValueOnce(recipes);

			const result = await gameDataStore.performLoadRecipes();

			const buildingTicker: string[] = Array.from(
				new Set(recipes.map((r) => r.BuildingTicker))
			);

			expect(result).toBeTruthy();
			expect(Object.keys(gameDataStore.recipes).length).toBe(
				buildingTicker.length
			);
		});

		it("performLoadRecipes: failure", async () => {
			vi.mocked(callDataRecipes).mockRejectedValueOnce(new Error());

			const result = await gameDataStore.performLoadRecipes();
			expect(result).toBeFalsy();
		});

		it("performLoadBuildings: success", async () => {
			// @ts-expect-error mock
			vi.mocked(callDataBuildings).mockResolvedValueOnce(buildings);

			const result = await gameDataStore.performLoadBuildings();

			expect(result).toBeTruthy();
			expect(Object.keys(gameDataStore.buildings).length).toBe(
				buildings.length
			);
		});

		it("performLoadBuildings: failure", async () => {
			vi.mocked(callDataBuildings).mockRejectedValueOnce(new Error());

			const result = await gameDataStore.performLoadBuildings();
			expect(result).toBeFalsy();
		});

		it("performLoadPlanet: success", async () => {
			// @ts-expect-error mock data
			vi.mocked(callDataPlanet).mockResolvedValueOnce(planet_single);

			const result = await gameDataStore.performLoadPlanet();

			expect(result).toBeTruthy();
			expect(
				gameDataStore.planets[planet_single.PlanetNaturalId]
			).toStrictEqual(planet_single);
		});

		it("performLoadPlanet: failure", async () => {
			vi.mocked(callDataPlanet).mockRejectedValueOnce(new Error());

			const result = await gameDataStore.performLoadPlanet();
			expect(result).toBeFalsy();
		});

		it("performLoadMultiplePlanets: User not authenticated", async () => {
			await expect(
				gameDataStore.performLoadMultiplePlanets(["foo"])
			).rejects.toThrowError();
		});

		it("performLoadMultiplePlanets: not all loaded", async () => {
			// @ts-expect-error mock data
			vi.mocked(callDataMultiplePlanets).mockResolvedValueOnce(planets);

			const userStore = useUserStore();
			userStore.accessToken = "foo";
			userStore.refreshToken = "moo";

			const testDataPlanets: string[] = ["foo", "moo"];

			const result =
				await gameDataStore.performLoadMultiplePlanets(testDataPlanets);

			expect(result).toBeFalsy();
		});

		it("performLoadMultiplePlanets: success", async () => {
			// @ts-expect-error mock data
			vi.mocked(callDataMultiplePlanets).mockResolvedValueOnce(planets);

			const userStore = useUserStore();
			userStore.accessToken = "foo";
			userStore.refreshToken = "moo";

			const testDataPlanets: string[] = ["KW-020c"];

			const result =
				await gameDataStore.performLoadMultiplePlanets(testDataPlanets);

			expect(result).toBeTruthy();
		});
	});
});

describe("performStaleDataRefresh", async () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("should refresh stale data", async () => {
		/*
			This needs more testing, have not yet found a way to properly create
			test casees for this.

			PR highly welcome!
		*/

		const gameDataStore = useGameDataStore();
		const spyPerform = vi.spyOn(gameDataStore, "performStaleDataRefresh");

		await gameDataStore.performStaleDataRefresh();

		expect(spyPerform).toBeCalledTimes(1);
	});
});
