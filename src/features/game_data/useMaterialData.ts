import { toRaw } from "vue";

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
		const findMaterial: IMaterial | undefined = toRaw(
			gameDataStore.materials[ticker]
		);

		if (findMaterial) return findMaterial;

		throw new Error(
			`No data: Material '${ticker}'. Ensure ticker is valid and game data has been loaded.`
		);
	}

	return {
		getMaterial,
	};
}
