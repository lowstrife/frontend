// Composables
import { useMaterialData } from "@/features/game_data/useMaterialData";

// Types & Interfaces
import {
	IMaterialIO,
	IMaterialIOMinimal,
} from "@/features/planning/usePlanCalculation.types";

export function useMaterialIOUtil() {
	const { getMaterial } = useMaterialData();

	function combineMaterialIOMinimal(
		arrays: IMaterialIOMinimal[][]
	): IMaterialIOMinimal[] {
		const combinedArray: IMaterialIOMinimal[] = arrays.flat();
		const tickerMap: { [key: string]: IMaterialIOMinimal } = {};

		combinedArray.forEach(({ ticker, input, output }) => {
			if (!tickerMap[ticker]) {
				tickerMap[ticker] = { ticker, input: 0, output: 0 };
			}

			tickerMap[ticker].input += input;
			tickerMap[ticker].output += output;
		});

		return Object.values(tickerMap);
	}

	function enhanceMaterialIOMinimal(data: IMaterialIOMinimal[]): IMaterialIO[] {
		const enhancedArray: IMaterialIO[] = [];

		data.forEach((minimal) => {
			const material = getMaterial(minimal.ticker);

			enhancedArray.push({
				ticker: minimal.ticker,
				input: minimal.input,
				output: minimal.output,
				delta: minimal.output - minimal.input,
				individualWeight: material.Weight,
				individualVolume: material.Volume,
				totalWeight: Math.abs(minimal.output - minimal.input) * material.Weight,
				totalVolume: Math.abs(minimal.output - minimal.input) * material.Volume,
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
