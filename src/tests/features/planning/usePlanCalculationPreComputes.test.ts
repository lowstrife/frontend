import { ref } from "vue";
import { describe, it, expect, beforeAll, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Composables
import { usePlanCalculationPreComputes } from "@/features/planning/usePlanCalculationPreComputes";

// test data
import recipes from "@/tests/test_data/api_data_recipes.json";
import buildings from "@/tests/test_data/api_data_buildings.json";
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";

describe("usePlanCalculationPreComputes", async () => {
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();

		materials.map((m) => {
			gameDataStore.materials[m.Ticker] = m;
		});

		buildings.map((b) => {
			gameDataStore.buildings[b.Ticker] = b;
		});

		recipes.map((r) => {
			if (!gameDataStore.recipes[r.BuildingTicker]) {
				gameDataStore.recipes[r.BuildingTicker] = [];
			}

			gameDataStore.recipes[r.BuildingTicker].push(r);
		});

		exchanges.map((e) => {
			gameDataStore.exchanges[e.TickerId] = e;
		});
	});

	it("computedBuildingTicker", async () => {
		const fakeBuildings = [{ name: "foo" }, { name: "moo" }];

		const { computedBuildingTicker } = usePlanCalculationPreComputes(
			// @ts-expect-error mock data
			ref(fakeBuildings),
			ref(undefined),
			ref(undefined),
			ref(undefined),
			ref(""),
			ref({})
		);

		expect(computedBuildingTicker.value).toStrictEqual(["foo", "moo"]);
	});

	it("computedBuildingInformation", async () => {
		const fakeBuildings = [{ name: "PP1" }];

		const { computedBuildingInformation } = usePlanCalculationPreComputes(
			// @ts-expect-error mock data
			ref(fakeBuildings),
			ref(undefined),
			ref(undefined),
			ref(undefined),
			ref(""),
			ref({})
		);

		const pp1Data = computedBuildingInformation.value.PP1;

		expect(pp1Data.buildingData.AreaCost).toBe(19);
		expect(pp1Data.buildingData.BuildingCosts.length).toBe(3);
		expect(pp1Data.buildingRecipes.length).toBe(4);
		expect(pp1Data.constructionCost).toBe(-54453.42685699004);
		expect(pp1Data.constructionMaterials.length).toBe(4);
		expect(pp1Data.workforceMaterials.length).toBe(5);
	});

	describe("computedActiveEmpire", async () => {
		it("no empire uuid present", async () => {
			const { computedActiveEmpire } = usePlanCalculationPreComputes(
				// @ts-expect-error mock data
				ref({}),
				ref(undefined),
				ref(undefined),
				ref(undefined),
				ref(""),
				ref({})
			);

			expect(computedActiveEmpire.value).toBe(undefined);
		});

		it("empire uuid present in options", async () => {
			const { computedActiveEmpire } = usePlanCalculationPreComputes(
				// @ts-expect-error mock data
				ref({}),
				ref(undefined),
				ref("foo"),
				ref([
					{
						uuid: "foo",
					},
					{
						uuid: "moo",
					},
				]),
				ref(""),
				ref({})
			);

			expect(computedActiveEmpire.value).toStrictEqual({ uuid: "foo" });
		});

		it("empire uuid missing in options", async () => {
			const { computedActiveEmpire } = usePlanCalculationPreComputes(
				// @ts-expect-error mock data
				ref({}),
				ref(undefined),
				ref("meow"),
				ref([
					{
						uuid: "foo",
					},
					{
						uuid: "moo",
					},
				]),
				ref(""),
				ref({})
			);

			expect(computedActiveEmpire.value).toBeUndefined();
		});
	});
});
