import { PlanResult } from "../usePlanCalculation.types";
import { combineMaterialIOMinimal } from "../util/materialIO.util";

const TOTALMSDAY: number = 24 * 60 * 60 * 1000;

export function calculateMaterialIO(
	data: PlanResult.ProductionBuilding[]
): PlanResult.MaterialIOMinimal[] {
	const materialIO: PlanResult.MaterialIOMinimal[][] = [];

	data.forEach((building) => {
		const batchRuns: number =
			(TOTALMSDAY * building.amount) / building.totalBatchTime;

		let buildingMaterialIOInput: PlanResult.MaterialIOMinimal[] = [];
		let buildingMaterialIOOutput: PlanResult.MaterialIOMinimal[] = [];

		// iterate over active_recipes
		building.activeRecipes.forEach((ar) => {
			// handle inputs
			ar.recipe.Inputs.forEach((arInput) => {
				buildingMaterialIOInput = combineMaterialIOMinimal([
					buildingMaterialIOInput,
					[
						{
							ticker: arInput.Ticker,
							input: arInput.Amount * ar.amount * batchRuns,
							output: 0,
						},
					],
				]);
			});
			// handle outputs
			ar.recipe.Outputs.forEach((arOutput) => {
				buildingMaterialIOOutput = combineMaterialIOMinimal([
					buildingMaterialIOOutput,
					[
						{
							ticker: arOutput.Ticker,
							input: 0,
							output: arOutput.Amount * ar.amount * batchRuns,
						},
					],
				]);
			});
		});

		materialIO.push(
			combineMaterialIOMinimal([
				buildingMaterialIOInput,
				buildingMaterialIOOutput,
			])
		);
	});

	return combineMaterialIOMinimal(materialIO);
}
