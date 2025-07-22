// useGameDataLoader.spec.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, nextTick } from "vue";
import { useGameDataLoader } from "@/features/wrapper/useGameDataLoader";
import { useQueryStore } from "@/lib/query_cache/queryStore";
import { useQueryRepository } from "@/lib/query_cache/queryRepository";

// Mock Store & Repository
vi.mock("@/lib/query_cache/queryStore", () => ({
	useQueryStore: vi.fn(),
}));

vi.mock("@/lib/query_cache/queryRepository", () => ({
	useQueryRepository: vi.fn(),
}));

const mockExecuteQuery = vi.fn();
const mockEmits = vi.fn();

const mockRepository = {
	GetMaterials: vi.fn(),
	GetExchanges: vi.fn(),
	GetBuildings: vi.fn(),
	GetRecipes: vi.fn(),
	GetPlanet: vi.fn(),
	GetMultiplePlanets: vi.fn(),
};

beforeEach(() => {
	mockExecuteQuery.mockReset();
	mockEmits.mockReset();
	Object.values(mockRepository).forEach((fn) => fn.mockReset());

	(useQueryStore as any).mockReturnValue({
		executeQuery: mockExecuteQuery,
	});

	(useQueryRepository as any).mockReturnValue({
		repository: mockRepository,
	});
});

describe("useGameDataLoader", () => {
	it("should not trigger any steps if all props are false", async () => {
		const props = {
			loadMaterials: false,
			loadExchanges: false,
			loadBuildings: false,
			loadRecipes: false,
			loadPlanet: undefined,
			loadPlanetMultiple: undefined,
		};

		const { allLoaded, hasError, done, loadingSteps, results } =
			useGameDataLoader(props, mockEmits);

		await nextTick();

		expect(mockExecuteQuery).not.toHaveBeenCalled();
		expect(allLoaded.value).toBe(true);
		expect(hasError.value).toBe(false);
		expect(done.value).toBe(true);
		expect(mockEmits).toHaveBeenCalledWith("complete");
		expect(loadingSteps.value).toEqual([]);
		expect(results.value).toEqual({
			materialData: null,
			exchangeData: null,
			buildingData: null,
			recipeData: null,
			planetData: null,
			planetMultipleData: null,
		});
	});

	it("should load materials and emit data", async () => {
		const props = {
			loadMaterials: true,
			loadExchanges: false,
			loadBuildings: false,
			loadRecipes: false,
			loadPlanet: undefined,
			loadPlanetMultiple: undefined,
		};

		const mockData = [{ id: 1, name: "Iron" }];
		mockExecuteQuery.mockResolvedValueOnce(mockData);

		const { allLoaded, hasError, done, results } = useGameDataLoader(
			props,
			mockEmits
		);

		await nextTick();
		await nextTick(); // wait for promise resolution

		expect(mockExecuteQuery).toHaveBeenCalled();
		expect(mockEmits).toHaveBeenCalledWith("data:materials", mockData);
	});

	const loadCases = [
		{
			props: {
				loadMaterials: true,
				loadExchanges: false,
				loadBuildings: false,
				loadRecipes: false,
				loadPlanet: undefined,
				loadPlanetMultiple: undefined,
			},
			emit: "data:materials",
		},
		{
			props: {
				loadMaterials: false,
				loadExchanges: true,
				loadBuildings: false,
				loadRecipes: false,
				loadPlanet: undefined,
				loadPlanetMultiple: undefined,
			},
			emit: "data:exchanges",
		},
		{
			props: {
				loadMaterials: false,
				loadExchanges: false,
				loadBuildings: true,
				loadRecipes: false,
				loadPlanet: undefined,
				loadPlanetMultiple: undefined,
			},
			emit: "data:buildings",
		},
		{
			props: {
				loadMaterials: false,
				loadExchanges: false,
				loadBuildings: false,
				loadRecipes: true,
				loadPlanet: undefined,
				loadPlanetMultiple: undefined,
			},
			emit: "data:recipes",
		},
		{
			props: {
				loadMaterials: false,
				loadExchanges: false,
				loadBuildings: false,
				loadRecipes: false,
				loadPlanet: "foo",
				loadPlanetMultiple: undefined,
			},
			emit: "data:planet",
		},
		{
			props: {
				loadMaterials: false,
				loadExchanges: false,
				loadBuildings: false,
				loadRecipes: false,
				loadPlanet: undefined,
				loadPlanetMultiple: ["foo", "moo"],
			},
			emit: "data:planet:multiple",
		},
	];

	it.each(loadCases)(
		"should load all and emit data",
		async ({ props, emit }) => {
			const mockData = [{ id: 1, name: "Iron" }];
			mockExecuteQuery.mockResolvedValueOnce(mockData);

			const { allLoaded, hasError, done, results } = useGameDataLoader(
				props,
				mockEmits
			);

			await nextTick();
			await nextTick(); // wait for promise resolution

			expect(mockExecuteQuery).toHaveBeenCalled();
			expect(mockEmits).toHaveBeenCalledWith(emit, mockData);
		}
	);

	it("should handle errors and set hasError", async () => {
		const props = {
			loadMaterials: true,
			loadExchanges: false,
			loadBuildings: false,
			loadRecipes: false,
			loadPlanet: undefined,
			loadPlanetMultiple: undefined,
		};

		mockExecuteQuery.mockRejectedValueOnce(new Error("Failed to load"));

		const { hasError, allLoaded, done } = useGameDataLoader(
			props,
			mockEmits
		);

		await nextTick();
		await nextTick();

		expect(mockExecuteQuery).toHaveBeenCalled();
		expect(hasError.value).toBe(true);
		expect(allLoaded.value).toBe(false);
		expect(done.value).toBe(false);
		expect(mockEmits).not.toHaveBeenCalledWith("complete");
	});

	it("should load multiple steps and emit all", async () => {
		const props = {
			loadMaterials: true,
			loadExchanges: true,
			loadBuildings: false,
			loadRecipes: false,
			loadPlanet: undefined,
			loadPlanetMultiple: undefined,
		};

		const materials = [{ id: 1 }];
		const exchanges = [{ id: 2 }];

		mockExecuteQuery
			.mockResolvedValueOnce(materials)
			.mockResolvedValueOnce(exchanges);

		useGameDataLoader(props, mockEmits);

		await nextTick();
		await nextTick();

		expect(mockEmits).toHaveBeenCalledWith("data:materials", materials);
		expect(mockEmits).toHaveBeenCalledWith("data:exchanges", exchanges);
		// expect(mockEmits).toHaveBeenCalledWith("complete");
	});
});
