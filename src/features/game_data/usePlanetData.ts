// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Interfaces & Types
import { IPlanet } from "@/features/game_data/gameData.types";

export function usePlanetData() {
	const gameDataStore = useGameDataStore();

	
	/**
	 * Gets Planet information from gamedata store
	 * 
	 * @author jplacht
	 *
	 * @param {string} planetNaturalId Planet Natural Id (e.g. 'OT-580b')
	 * @returns {IPlanet} Planet
	 */
	function getPlanet(planetNaturalId: string): IPlanet {
		if (!Object.keys(gameDataStore.planets).includes(planetNaturalId)) {
			throw new Error(
				`No data: Planet '${planetNaturalId}'. Ensure planet natural id is valid and data loaded`
			);
		}

		return gameDataStore.planets[planetNaturalId];
	}

	return {
		getPlanet,
	};
}
