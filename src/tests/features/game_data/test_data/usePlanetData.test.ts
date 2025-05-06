import { setActivePinia, createPinia } from "pinia";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { useGameDataStore } from "@/stores/gameDataStore";
import { usePlanetData } from "@/features/game_data/usePlanetData";

// test data
import planet_single from "@/tests/features/game_data/test_data/api_data_planet_single.json";

describe("usePlanetData", async () => {
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();
	});

	beforeEach(() => {
		gameDataStore.buildings = {};
	});

	describe("getPlanet", async () => {
		it("Get valid planet", async () => {
			gameDataStore.planets["KW-020c"] = planet_single;
			const { getPlanet } = usePlanetData();

			expect(getPlanet("KW-020c")).toStrictEqual(planet_single);
		});
		it("Get invalid", async () => {
			const { getPlanet } = usePlanetData();

			expect(() => getPlanet("foo")).toThrowError();
		});
	});
});
