// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Interfaces & Types
import {
	IBuilding,
	IPlanetResource,
	IRecipe,
	PLANET_RESOURCETYPE_TYPE,
} from "@/features/game_data/gameData.types";
import { PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";
import { SelectMixedOption } from "naive-ui/es/select/src/interface";
import { calculateExtraction } from "../planning/calculations/extractionCalculations";
import { toRaw } from "vue";

export function useBuildingData() {
	const gameDataStore = useGameDataStore();

	const resourceBuildingTicker: Record<string, PLANET_RESOURCETYPE_TYPE> = {
		EXT: "MINERAL",
		COL: "GASEOUS",
		RIG: "LIQUID",
	};

	function getBuilding(buildingTicker: string): IBuilding {
		if (!Object.keys(gameDataStore.buildings).includes(buildingTicker)) {
			throw new Error(
				`No data: Building '${buildingTicker}'. Ensure ticker is valid and game data has been loaded.`
			);
		}

		return gameDataStore.buildings[buildingTicker];
	}

	function getProductionBuildingOptions(
		existing: string[] = [],
		cogc: PLAN_COGCPROGRAM_TYPE | undefined = undefined
	): SelectMixedOption[] {
		const options: SelectMixedOption[] = [];

		Object.values(gameDataStore.buildings).forEach((building) => {
			// only production buildings that are not in existing list
			if (building.Habitation === null && !existing.includes(building.Ticker)) {
				// check for matching COGC
				if (cogc && building.Expertise != cogc) {
					return;
				}

				options.push({
					value: building.Ticker,
					label:
						building.Ticker +
						" (" +
						building.Name.replace(/([A-Z])/g, " $1")
							.trim()
							.charAt(0)
							.toUpperCase() +
						building.Name.replace(/([A-Z])/g, " $1")
							.trim()
							.slice(1) +
						")",
				});
			}
		});

		return options;
	}

	function getBuildingRecipes(
		buildingTicker: string,
		planetResources: IPlanetResource[] = []
	): IRecipe[] {
		if (Object.keys(resourceBuildingTicker).includes(buildingTicker)) {
			// use planet resources to fetch recipes
			if (planetResources.length === 0) return [];

			const searchType: PLANET_RESOURCETYPE_TYPE =
				resourceBuildingTicker[buildingTicker];
			const relevantResources: IPlanetResource[] = planetResources.filter(
				(r) => r.ResourceType === searchType
			);

			// create individual resource recipes
			const resourceRecipes: IRecipe[] = relevantResources.map((res) => {
				const { timeMs, extractionAmount } = calculateExtraction(
					res.ResourceType,
					res.DailyExtraction
				);

				return {
					RecipeId: `${buildingTicker}#${res.MaterialTicker}`,
					BuildingTicker: buildingTicker,
					RecipeName: buildingTicker,
					TimeMs: timeMs,
					Inputs: [],
					Outputs: [{ Ticker: res.MaterialTicker, Amount: extractionAmount }],
				};
			});

			relevantResources.forEach((res) => {});

			return resourceRecipes;
		} else {
			if (!Object.keys(gameDataStore.recipes).includes(buildingTicker)) {
				throw new Error(
					`No recipe data: Building '${buildingTicker}'. Ensure ticker is valid and game data has been loaded.`
				);
			}

			return toRaw(gameDataStore.recipes[buildingTicker]);
		}
	}

	function getTotalWorkforce(building: IBuilding): number {
		return (
			building.Pioneers +
			building.Settlers +
			building.Technicians +
			building.Engineers +
			building.Scientists
		);
	}

	return {
		getBuilding,
		getProductionBuildingOptions,
		getBuildingRecipes,
		getTotalWorkforce,
	};
}
