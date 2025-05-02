// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Interfaces & Types
import { IMaterial } from "@/features/game_data/gameData.types";

export function useMaterialData() {
	const gameDataStore = useGameDataStore();

	/**
	 * Gets material data by given ticker
	 * @author jplacht
	 *
	 * @param {string} ticker Material Ticker e.g. "DW"
	 * @returns {IMaterial} Material Data
	 */
	function getMaterial(ticker: string): IMaterial {
		if (!Object.keys(gameDataStore.materials).includes(ticker)) {
			throw new Error(
				`No data: Material '${ticker}'. Ensure ticker is valid and game data has been loaded.`
			);
		}

		return gameDataStore.materials[ticker];
	}

	return {
		getMaterial,
	};
}
