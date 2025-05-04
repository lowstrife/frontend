// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Interfaces & Types
import { IBuilding } from "@/features/game_data/gameData.types";

export function useBuildingData() {
	const gameDataStore = useGameDataStore();

	function getBuilding(buildingTicker: string): IBuilding {
		if (!Object.keys(gameDataStore.buildings).includes(buildingTicker)) {
			throw new Error(
				`No data: Building '${buildingTicker}'. Ensure ticker is valid and game data has been loaded.`
			);
		}

		return gameDataStore.buildings[buildingTicker];
	}

	return {
		getBuilding,
	};
}
