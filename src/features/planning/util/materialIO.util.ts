import { PlanResult } from "../usePlanCalculation.types";

import { useMaterialData } from "@/features/game_data/useMaterialData";

const { getMaterial } = useMaterialData();

export function combineMaterialIOMinimal(
	arrays: PlanResult.MaterialIOMinimal[][]
): PlanResult.MaterialIOMinimal[] {
	const combinedArray: PlanResult.MaterialIOMinimal[] = arrays.flat();
	const tickerMap: { [key: string]: PlanResult.MaterialIOMinimal } = {};

	combinedArray.forEach(({ ticker, input, output }) => {
		if (!tickerMap[ticker]) {
			tickerMap[ticker] = { ticker, input: 0, output: 0 };
		}

		tickerMap[ticker].input += input;
		tickerMap[ticker].output += output;
	});

	return Object.values(tickerMap);
}

export function enhanceMaterialIOMinimal(
	data: PlanResult.MaterialIOMinimal[]
): PlanResult.MaterialIO[] {
	const enhancedArray: PlanResult.MaterialIO[] = [];

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
