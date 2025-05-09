// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Util
import { boundaryDescriptor } from "@/util/numbers";

// Interfaces & Types
import { IPlanet } from "@/features/game_data/gameData.types";
import { IMaterialIOMinimal } from "../planning/usePlanCalculation.types";

/**
 * Planetary type static boundaries
 */

// Gravity
export const boundaryGravityLow: number = 0.25;
export const boundaryGravityHigh: number = 2.5;

// Pressure
export const boundaryPressureLow: number = 0.25;
export const boundaryPressureHigh: number = 2.0;

// Temperature
export const boundaryTemperatureLow: number = -25.0;
export const boundaryTemperatureHigh: number = 75.0;

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
		const findPlanet: IPlanet | undefined =
			gameDataStore.planets[planetNaturalId];

		if (findPlanet) return findPlanet;

		throw new Error(
			`No data: Planet '${planetNaturalId}'. Ensure planet natural id is valid and data loaded`
		);
	}

	/**
	 * Gets a planets additional building materials based on
	 * its conditions like Surface, Temperature or Gravity
	 *
	 * @author jplacht
	 *
	 * @param {IPlanet} planet Planet Data
	 * @param {number} areaCost Buildings AreaCost
	 * @returns {IMaterialIOMinimal[]} Special Construction Materials
	 */
	function getPlanetSpecialMaterials(
		planet: IPlanet,
		areaCost: number
	): IMaterialIOMinimal[] {
		const additions: IMaterialIOMinimal[] = [];

		// Rocky
		if (planet.Surface)
			additions.push({ ticker: "MCG", input: areaCost * 4, output: 0 });
		// Gaseous
		else
			additions.push({
				ticker: "AEF",
				input: Math.ceil(areaCost / 3),
				output: 0,
			});

		const gravityType: BOUNDARY_DESCRIPTOR = boundaryDescriptor(
			planet.Gravity,
			boundaryGravityLow,
			boundaryGravityHigh
		);

		const pressureType: BOUNDARY_DESCRIPTOR = boundaryDescriptor(
			planet.Pressure,
			boundaryPressureLow,
			boundaryPressureHigh
		);

		const temperatureType: BOUNDARY_DESCRIPTOR = boundaryDescriptor(
			planet.Temperature,
			boundaryTemperatureLow,
			boundaryTemperatureHigh
		);

		// Gravity
		if (gravityType === "LOW")
			additions.push({ ticker: "MGC", input: 1, output: 0 });
		else if (gravityType === "HIGH")
			additions.push({ ticker: "BL", input: 1, output: 0 });

		// Pressure
		if (pressureType === "LOW")
			additions.push({ ticker: "SEA", input: areaCost, output: 0 });
		else if (pressureType === "HIGH")
			additions.push({ ticker: "HSE", input: 1, output: 0 });

		// Temperature
		if (temperatureType === "LOW")
			additions.push({ ticker: "INS", input: areaCost * 10, output: 0 });
		else if (temperatureType === "HIGH")
			additions.push({ ticker: "TSH", input: 1, output: 0 });

		return additions;
	}

	return {
		getPlanet,
		getPlanetSpecialMaterials,
	};
}
