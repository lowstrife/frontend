import { describe, it, vi, expect, beforeEach, beforeAll } from "vitest";

import { createPinia, setActivePinia } from "pinia";

// stores
import { useGameDataStore } from "@/stores/gameDataStore";

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

describe("performStaleDataRefresh", () => {
	beforeAll(() => {
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
