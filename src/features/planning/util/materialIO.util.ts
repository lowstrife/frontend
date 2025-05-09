// Composables
import { useMaterialData } from "@/features/game_data/useMaterialData";

// Types & Interfaces
import {
	IMaterialIOMaterial,
	IMaterialIOMinimal,
} from "@/features/planning/usePlanCalculation.types";

export function useMaterialIOUtil() {
	const { getMaterial } = useMaterialData();

	/**
	 * Combines arrays of MaterialIOMinimal into a singular array
	 * with summed up input and output amounts per ticker
	 *
	 * @author jplacht
	 *
	 * @param {IMaterialIOMinimal[][]} arrays Array of MaterialIOMinimals
	 * @returns {IMaterialIOMinimal[]} combined array
	 */
	function combineMaterialIOMinimal(
		arrays: IMaterialIOMinimal[][]
	): IMaterialIOMinimal[] {
		const combinedArray: IMaterialIOMinimal[] = arrays.flat().filter((v) => v);

		const tickerMap: { [key: string]: IMaterialIOMinimal } = {};

		combinedArray.forEach(({ ticker, input, output }) => {
			if (!tickerMap[ticker]) {
				tickerMap[ticker] = { ticker: ticker, input: 0, output: 0 };
			}

			tickerMap[ticker].input += input as number;
			tickerMap[ticker].output += output as number;
		});

		return Object.values(tickerMap);
	}

	/**
	 * Enhances a MaterialIO Minimal with weight and volume
	 * information based on the arrays materials
	 *
	 * @author jplacht
	 *
	 * @param {IMaterialIOMinimal[]} data Minimal Array
	 * @returns {IMaterialIOMaterial[]} Array enhanced by Weight & Volume
	 */
	function enhanceMaterialIOMinimal(
		data: IMaterialIOMinimal[]
	): IMaterialIOMaterial[] {
		const enhancedArray: IMaterialIOMaterial[] = [];

		data.forEach((minimal) => {
			const material = getMaterial(minimal.ticker);

			enhancedArray.push({
				ticker: minimal.ticker,
				input: minimal.input,
				output: minimal.output,
				delta: minimal.output - minimal.input,
				individualWeight: material.Weight,
				individualVolume: material.Volume,
				totalWeight: (minimal.output - minimal.input) * material.Weight,
				totalVolume: (minimal.output - minimal.input) * material.Volume,
			});
		});

		// return sorted
		return enhancedArray.sort((a, b) => (a.ticker > b.ticker ? 1 : -1));
	}

	return {
		combineMaterialIOMinimal,
		enhanceMaterialIOMinimal,
	};
}
