import { createApp, nextTick } from "vue";
import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { initializeLocalStorage } from "@/tests/stores/store.util";

// stores
import { useGameDataStore } from "@/stores/gameDataStore";

describe("Hydration from localStorage", async () => {
	// See: https://github.com/prazdevs/pinia-plugin-persistedstate/blob/v3/packages/plugin/tests/plugin.spec.ts

	beforeEach(() => {
		const app = createApp({});
		const pinia = createPinia();
		pinia.use(piniaPluginPersistedstate);
		app.use(pinia);
		setActivePinia(pinia);
	});

	const mockPlanet: string = "foo";
	const mockDate: string = "2025-05-01T00:00:00.000Z";

	it("Datetime hydration: dates available", async () => {
		//* arrange
		initializeLocalStorage("prunplanner_game_data", {
			lastRefreshedMaterials: mockDate,
			lastRefreshedExchanges: mockDate,
			lastRefreshedRecipes: mockDate,
			lastRefreshedBuildings: mockDate,
			lastRefreshedPlanets: {
				foo: mockDate,
			},
		});

		//* act
		await nextTick();
		const store = useGameDataStore();
		store.$hydrate();
		await nextTick();

		// expect date transformation to be done
		expect(store.lastRefreshedMaterials).toBeTypeOf("object");
		expect(store.lastRefreshedMaterials).toStrictEqual(new Date(mockDate));
		expect(store.lastRefreshedExchanges).toBeTypeOf("object");
		expect(store.lastRefreshedExchanges).toStrictEqual(new Date(mockDate));
		expect(store.lastRefreshedRecipes).toBeTypeOf("object");
		expect(store.lastRefreshedRecipes).toStrictEqual(new Date(mockDate));
		expect(store.lastRefreshedBuildings).toBeTypeOf("object");
		expect(store.lastRefreshedBuildings).toStrictEqual(new Date(mockDate));

		expect(Object.keys(store.lastRefreshedPlanets)).toStrictEqual(["foo"]);

		expect(store.lastRefreshedPlanets[mockPlanet]).toBeTypeOf("object");
		expect(store.lastRefreshedPlanets[mockPlanet]).toStrictEqual(
			new Date(mockDate)
		);
	});

	it("Datetime hydration: dates not available", async () => {
		//* arrange
		localStorage.clear();

		//* act
		await nextTick();
		const store = useGameDataStore();
		store.$hydrate();
		await nextTick();

		// expect dates to be empty as no localStorage available
		expect(store.lastRefreshedMaterials).toBeUndefined();
		expect(store.lastRefreshedExchanges).toBeUndefined();
		expect(store.lastRefreshedRecipes).toBeUndefined();
		expect(store.lastRefreshedBuildings).toBeUndefined();
	});
});
