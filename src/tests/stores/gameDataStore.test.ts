import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// test data
import recipes from "@/tests/test_data/api_data_recipes.json";
import buildings from "@/tests/test_data/api_data_buildings.json";
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";
import planets from "@/tests/test_data/api_data_planets.json";
import planet_single from "@/tests/test_data/api_data_planet_single.json";
import fio_sites from "@/tests/test_data/api_data_fio_sites.json";
import fio_storage from "@/tests/test_data/api_data_fio_storage.json";

// mocks
vi.mock("@/features/api/gameData.api", async () => {
	return {
		...(await vi.importActual("@/features/api/gameData.api")),
		callDataMaterials: vi.fn(),
		callDataExchanges: vi.fn(),
		callDataRecipes: vi.fn(),
		callDataBuildings: vi.fn(),
		callDataPlanet: vi.fn(),
		callDataMultiplePlanets: vi.fn(),
		callDataFIOSites: vi.fn(),
		callDataFIOStorage: vi.fn(),
	};
});

import {
	callDataMaterials,
	callDataExchanges,
	callDataRecipes,
	callDataBuildings,
	callDataPlanet,
	callDataMultiplePlanets,
	callDataFIOSites,
	callDataFIOStorage,
} from "@/features/api/gameData.api";

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
			gameDataStore.isRefreshingMaterials = true;
			gameDataStore.promiseRefreshingMaterials = Promise.resolve(true);

			const result = await gameDataStore.performLoadMaterials();

			expect(result).toBe(null);
			expect(callDataMaterials).not.toHaveBeenCalled();
		});

		it("Buildings singular refresh", async () => {
			gameDataStore.isRefreshingBuildings = true;
			gameDataStore.promiseRefreshingBuildings = Promise.resolve(true);

			const result = await gameDataStore.performLoadBuildings();

			expect(result).toBe(null);
			expect(callDataBuildings).not.toHaveBeenCalled();
		});

		it("Exchanges singular refresh", async () => {
			gameDataStore.isRefreshingExchanges = true;
			gameDataStore.promiseRefreshingExchanges = Promise.resolve(true);

			const result = await gameDataStore.performLoadExchanges();

			expect(result).toBe(null);
			expect(callDataExchanges).not.toHaveBeenCalled();
		});

		it("Recipes singular refresh", async () => {
			gameDataStore.isRefreshingRecipes = true;
			gameDataStore.promiseRefreshingRecipes = Promise.resolve(true);

			const result = await gameDataStore.performLoadRecipes();

			expect(result).toBe(null);
			expect(callDataRecipes).not.toHaveBeenCalled();
		});

		it("Planets singular refresh", async () => {
			gameDataStore.isRefreshingPlanets = { "KW-020c": true };
			gameDataStore.promiseRefreshingPlanets = {
				"KW-020c": Promise.resolve(true),
			};

			const result = await gameDataStore.performLoadPlanet("KW-020c");

			expect(result).toBe(undefined);
			expect(callDataPlanet).not.toHaveBeenCalled();
		});
	});

	describe("Functions", () => {
		it("hasPlanet", () => {
			expect(
				gameDataStore.hasPlanet(planet_single.PlanetNaturalId)
			).toBeFalsy();

			// add single
			gameDataStore.planets[planet_single.PlanetNaturalId] =
				planet_single;

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
				(planet) =>
					(gameDataStore.planets[planet.PlanetNaturalId] = planet)
			);

			expect(gameDataStore.hasMultiplePlanets(ids)).toBeTruthy();
		});

		describe("getPlanet", async () => {
			it("No force, has planet data", async () => {
				// mock
				gameDataStore.planets["foo"] = true;

				const result = await gameDataStore.getPlanet("foo");

				expect(result).toBe(true);
			});

			it("No force, needs to fetch planet data", async () => {
				// @ts-expect-error mock data
				vi.mocked(callDataPlanet).mockResolvedValueOnce(planet_single);

				const result = await gameDataStore.getPlanet("KW-020c");
				expect(result).toStrictEqual(planet_single);
			});

			it("No force, needs to fetch planet data but getting error", async () => {
				gameDataStore.isRefreshingPlanets = { "KW-020c": true };
				gameDataStore.promiseRefreshingPlanets = {
					"KW-020c": Promise.resolve(false),
				};

				await expect(
					gameDataStore.getPlanet("KW-020c")
				).rejects.toThrowError();
			});

			it("Force, needs to fetch planet data ", async () => {
				// @ts-expect-error mock data
				vi.mocked(callDataPlanet).mockResolvedValueOnce(planet_single);

				await expect(
					gameDataStore.getPlanet("KW-020c", true)
				).resolves.toStrictEqual(planet_single);
			});

			it("Force, needs to fetch planet data but getting error", async () => {
				gameDataStore.isRefreshingPlanets = { "KW-020c": true };
				gameDataStore.promiseRefreshingPlanets = {
					"KW-020c": Promise.resolve(false),
				};

				await expect(
					gameDataStore.getPlanet("KW-020c", true)
				).rejects.toThrowError();
			});
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

		it("performLoadMultiplePlanets: empty input", async () => {
			await expect(
				gameDataStore.performLoadMultiplePlanets([])
			).resolves.toBeTruthy();
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

		it("performLoadMultiplePlanets: all existing", async () => {
			// @ts-expect-error mock data
			vi.mocked(callDataMultiplePlanets).mockResolvedValueOnce(planets);

			const userStore = useUserStore();
			userStore.accessToken = "foo";
			userStore.refreshToken = "moo";

			gameDataStore.planets["foo"] = {};

			const testDataPlanets: string[] = ["foo"];

			const result =
				await gameDataStore.performLoadMultiplePlanets(testDataPlanets);

			expect(result).toBeTruthy();
		});

		describe("performFIORefresh", async () => {
			it("success", async () => {
				// @ts-expect-error mock data
				vi.mocked(callDataFIOSites).mockResolvedValueOnce(fio_sites);
				vi.mocked(callDataFIOStorage).mockResolvedValueOnce(
					// @ts-expect-error mock data
					fio_storage
				);

				const result = await gameDataStore.performFIORefresh();

				expect(result).toBeTruthy();
			});

			it("storage failure", async () => {
				// @ts-expect-error mock data
				vi.mocked(callDataFIOSites).mockResolvedValueOnce(fio_sites);
				vi.mocked(callDataFIOStorage).mockRejectedValueOnce(
					new Error()
				);

				const result = await gameDataStore.performFIORefresh();

				expect(result).toBeFalsy();
			});

			it("sites failure", async () => {
				vi.mocked(callDataFIOSites).mockRejectedValueOnce(new Error());
				vi.mocked(callDataFIOStorage).mockResolvedValueOnce(
					// @ts-expect-error mock data
					fio_storage
				);

				const result = await gameDataStore.performFIORefresh();

				expect(result).toBeFalsy();
			});
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

describe("resetter", async () => {
	let gameDataStore: any;

	beforeEach(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();
	});

	it("reset materials", async () => {
		gameDataStore.materials["foo"] = "moo";
		gameDataStore.lastRefreshedMaterials = new Date();

		expect(Object.keys(gameDataStore.materials).length).toBe(1);
		expect(gameDataStore.lastRefreshedMaterials).toBeDefined();

		gameDataStore.resetMaterials();

		expect(Object.keys(gameDataStore.materials).length).toBe(0);
		expect(gameDataStore.lastRefreshedMaterials).toBeUndefined();
	});

	it("reset buildings", async () => {
		gameDataStore.buildings["foo"] = "moo";
		gameDataStore.lastRefreshedBuildings = new Date();

		expect(Object.keys(gameDataStore.buildings).length).toBe(1);
		expect(gameDataStore.lastRefreshedBuildings).toBeDefined();

		gameDataStore.resetBuildings();

		expect(Object.keys(gameDataStore.buildings).length).toBe(0);
		expect(gameDataStore.lastRefreshedBuildings).toBeUndefined();
	});

	it("reset recipes", async () => {
		gameDataStore.recipes["foo"] = "moo";
		gameDataStore.lastRefreshedRecipes = new Date();

		expect(Object.keys(gameDataStore.recipes).length).toBe(1);
		expect(gameDataStore.lastRefreshedRecipes).toBeDefined();

		gameDataStore.resetRecipes();

		expect(Object.keys(gameDataStore.recipes).length).toBe(0);
		expect(gameDataStore.lastRefreshedRecipes).toBeUndefined();
	});

	it("reset planets", async () => {
		gameDataStore.planets["foo"] = "moo";
		gameDataStore.lastRefreshedPlanets["foo"] = new Date();

		expect(Object.keys(gameDataStore.planets).length).toBe(1);
		expect(gameDataStore.lastRefreshedPlanets["foo"]).toBeDefined();

		gameDataStore.resetPlanets();

		expect(Object.keys(gameDataStore.planets).length).toBe(0);
		expect(gameDataStore.lastRefreshedPlanets["foo"]).toBeUndefined();
	});

	it("reset exchanges", async () => {
		gameDataStore.exchanges["foo"] = "moo";
		gameDataStore.lastRefreshedExchanges = new Date();

		expect(Object.keys(gameDataStore.exchanges).length).toBe(1);
		expect(gameDataStore.lastRefreshedExchanges).toBeDefined();

		gameDataStore.resetExchanges();

		expect(Object.keys(gameDataStore.exchanges).length).toBe(0);
		expect(gameDataStore.lastRefreshedExchanges).toBeUndefined();
	});
});
