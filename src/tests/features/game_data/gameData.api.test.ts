import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";

import { apiService } from "@/lib/apiService";
import axiosSetup from "@/util/axiosSetup";
import {
	callDataBuildings,
	callDataExchanges,
	callDataMaterials,
	callDataMultiplePlanets,
	callDataPlanet,
	callDataRecipes,
} from "@/features/game_data/gameData.api";

// test data
import recipes from "@/tests/test_data/api_data_recipes.json";
import buildings from "@/tests/test_data/api_data_buildings.json";
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";
import planets from "@/tests/test_data/api_data_planets.json";
import planet_single from "@/tests/test_data/api_data_planet_single.json";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("GameData API Calls", async () => {
	beforeAll(() => {
		setActivePinia(createPinia());
		axiosSetup();
	});

	it("callDataMaterials", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/data/materials").reply(200, materials);

		expect(await callDataMaterials()).toStrictEqual(materials);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callDataExchanges", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/data/exchanges").reply(200, exchanges);

		expect(await callDataExchanges()).toStrictEqual(exchanges);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callDataRecipes", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/data/recipes").reply(200, recipes);

		expect(await callDataRecipes()).toStrictEqual(recipes);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callDataBuildings", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/data/buildings").reply(200, buildings);

		expect(await callDataBuildings()).toStrictEqual(buildings);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callDataPlanet", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/data/planet/KW-020c").reply(200, planet_single);

		expect(await callDataPlanet("KW-020c")).toStrictEqual(planet_single);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callDataMultiplePlanets", async () => {
		const spyApiServicePost = vi.spyOn(apiService, "post");

		mock.onPost("/data/planet/multiple").reply(200, planets);

		expect(await callDataMultiplePlanets([])).toStrictEqual(planets);
		expect(spyApiServicePost).toHaveBeenCalled();
	});
});
