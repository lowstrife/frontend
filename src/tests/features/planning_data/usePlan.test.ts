import { describe, it, expect, beforeAll, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Composables
import { usePlan } from "@/features/planning_data/usePlan";

// test data
import shared from "@/tests/test_data/api_data_shared.json";
import planet_single from "@/tests/test_data/api_data_planet_single.json";
import empire_list from "@/tests/test_data/api_data_empire_list.json";

vi.mock("@/features/planning_data/planData.api", async () => {
	return {
		...(await vi.importActual("@/features/planning_data/planData.api")),
		callGetShared: vi.fn(),
	};
});

vi.mock("@/features/game_data/gameData.api", async () => {
	return {
		...(await vi.importActual("@/features/game_data/gameData.api")),
		callDataMaterials: vi.fn(),
		callDataExchanges: vi.fn(),
		callDataRecipes: vi.fn(),
		callDataBuildings: vi.fn(),
		callDataPlanet: vi.fn(),
		callDataMultiplePlanets: vi.fn(),
	};
});

import { callGetShared } from "@/features/planning_data/planData.api";
import { usePlanningStore } from "@/stores/planningStore";

describe("usePlan", async () => {
	let gameDataStore: any;
	let planningStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();
		planningStore = usePlanningStore();

		vi.resetAllMocks();
	});

	it("has shared plan uuid", async () => {
		const { isEditDisabled } = usePlan();

		// @ts-expect-error mock data
		expect(isEditDisabled({ sharedPlanUuid: "foo" })).toBeTruthy();
		// @ts-expect-error mock data
		expect(isEditDisabled({ sharedPlanUuid: undefined })).toBeFalsy();
	});

	it("mapPlanetToPlanType", async () => {
		const { mapPlanetToPlanType } = usePlan();

		expect(mapPlanetToPlanType("ADVERTISING_AGRICULTURE")).toBe("AGRICULTURE");
		expect(mapPlanetToPlanType(null)).toBe("---");
	});

	it("createBlankDefinition", async () => {
		const { createBlankDefinition } = usePlan();

		const result = createBlankDefinition("OT-580b", null);

		expect(result.planet_id).toBe("OT-580b");
		expect(result.baseplanner_data.planet.experts.length).toBe(9);
		expect(result.baseplanner_data.planet.workforce.length).toBe(5);
		expect(result.baseplanner_data.infrastructure.length).toBe(0);
		expect(result.baseplanner_data.buildings.length).toBe(0);
		expect(result.empires.length).toBe(0);
	});

	describe("loadDefinitionFromRouteParams", async () => {
		it("load shared success", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.performLoadPlanet = vi.fn().mockResolvedValue(true);
			// @ts-expect-error mock data
			vi.mocked(callGetShared).mockResolvedValue(shared);

			// @ts-expect-error mock data
			const result = await loadDefinitionFromRouteParams({
				sharedPlanUuid: "foo",
			});
		});

		it("load shared failure", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.performLoadPlanet = vi.fn().mockResolvedValue(true);
			vi.mocked(callGetShared).mockRejectedValueOnce(new Error());

			await expect(
				// @ts-expect-error mock data
				loadDefinitionFromRouteParams({
					sharedPlanUuid: "foo",
				})
			).rejects.toThrowError();
		});

		it("load planet failure", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.performLoadPlanet = vi.fn().mockResolvedValue(false);

			await expect(
				// @ts-expect-error mock data
				loadDefinitionFromRouteParams({
					sharedPlanUuid: "foo",
				})
			).rejects.toThrowError();
		});

		it("uuid, no planet uuid", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			await expect(
				// @ts-expect-error mock data
				loadDefinitionFromRouteParams({
					planUuid: "foo",
				})
			).rejects.toThrowError();
		});

		it("uuid, planet uuid invalid", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.getPlanet = vi.fn().mockResolvedValue(new Error());

			await expect(
				// @ts-expect-error mock data
				loadDefinitionFromRouteParams({
					planUuid: "foo",
				})
			).rejects.toThrowError();
		});

		it("uuid, planet failure", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.getPlanet = vi.fn().mockRejectedValue(new Error());

			await expect(
				// @ts-expect-error mock data
				loadDefinitionFromRouteParams({
					planUuid: "foo",
					planetNaturalId: "moo",
				})
			).rejects.toThrowError();
		});

		it("uuid, planet ok", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.getPlanet = vi.fn();
			planningStore.getAllEmpires = vi.fn().mockResolvedValue(empire_list);
			planningStore.getPlan = vi.fn();

			// @ts-expect-error mock data
			const result = await loadDefinitionFromRouteParams({
				planUuid: "foo",
				planetNaturalId: "KW-020c",
			});

			expect(result.planData).toBeUndefined();
		});

		it("uuid failure, planet ok", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.getPlanet = vi.fn();
			planningStore.getAllEmpires = vi.fn().mockResolvedValue(empire_list);
			planningStore.getPlan = vi.fn().mockRejectedValue(new Error());

			await expect(
				// @ts-expect-error mock data
				loadDefinitionFromRouteParams({
					planUuid: "foo",
					planetNaturalId: "KW-020c",
				})
			).rejects.toThrowError();
		});

		it("no uuid, planet ok", async () => {
			const { loadDefinitionFromRouteParams } = usePlan();

			gameDataStore.getPlanet = vi.fn().mockResolvedValue(planet_single);
			planningStore.getAllEmpires = vi.fn().mockResolvedValue(empire_list);
			planningStore.getPlan = vi.fn();

			// @ts-expect-error mock data
			const result = await loadDefinitionFromRouteParams({
				planUuid: undefined,
				planetNaturalId: "KW-020c",
			});

			expect(result.planData.planet_id).toBe("KW-020c");
		});
	});
});
