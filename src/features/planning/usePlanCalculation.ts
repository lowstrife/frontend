import { computed, ComputedRef, ref, Ref, toRaw, toRef } from "vue";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Composables
import { useBuildingData } from "@/features/game_data/useBuildingData";

// Util
import { clamp } from "@/util/numbers";

// Calculations
import {
	calculateSatisfaction,
	calculateSingleWorkforceConsumption,
	calculateWorkforceConsumption,
} from "@/features/planning/calculations/workforceCalculations";
import {
	calculateExpertBonus,
	calculateBuildingEfficiency,
} from "@/features/planning/calculations/bonusCalculations";

// Types & Interfaces
import { PlanResult } from "@/features/planning/usePlanCalculation.types";
import {
	IPlan,
	IPlanData,
	IPlanDataExpert,
	IPlanDataInfrastructure,
	IPlanDataPlanet,
	IPlanDataWorkforce,
	IPlanEmpire,
	PLAN_COGCPROGRAM_TYPE,
} from "@/features/planning/usePlan.types";
import {
	IBuilding,
	IPlanet,
	IRecipe,
} from "@/features/game_data/gameData.types";
import {
	combineMaterialIOMinimal,
	enhanceMaterialIOMinimal,
} from "./util/materialIO.util";
import { calculateMaterialIO } from "./calculations/buildingCalculations";

export function usePlanCalculation(
	plan: Ref<IPlan>,
	empireUuid: Ref<string | undefined> = ref(undefined)
) {
	// stores
	const gameDataStore = useGameDataStore();

	// composables
	const { getBuilding, getBuildingRecipes } = useBuildingData();

	// data references
	const data: Ref<IPlanData> = toRef(plan.value.baseplanner_data);
	const planet: Ref<IPlanDataPlanet> = toRef(data.value.planet);
	const empires: Ref<IPlanEmpire[]> = toRef(plan.value.empires);

	/**
	 * Holds data of the currently active empire based on all available
	 * empires and the empireUuid passed to this composable, will return
	 * the first empire if none is selected but multiple are available
	 * @author jplacht
	 *
	 * @type {ComputedRef<IPlanEmpire | undefined>}	Empire Information
	 */
	const activeEmpire: ComputedRef<IPlanEmpire | undefined> = computed(() => {
		if (empireUuid.value === undefined) {
			if (empires.value.length > 0) return empires.value[0];
			else return undefined;
		} else {
			const e: IPlanEmpire | undefined = empires.value.find(
				(f) => f.uuid === empireUuid.value
			);

			if (e) return e;
		}
		return undefined;
	});

	// static data
	const planetData: IPlanet = gameDataStore.planets[planet.value.planetid];

	// helper
	const workforceTypeNames: string[] = [
		"pioneer",
		"settler",
		"technician",
		"engineer",
		"scientist",
	];

	const infrastructureBuildingNames: string[] = [
		"HB1",
		"HB2",
		"HB3",
		"HB4",
		"HB5",
		"HBB",
		"HBC",
		"HBM",
		"HBL",
		"STO",
	];

	const expertNames: string[] = [
		"Agriculture",
		"Chemistry",
		"Construction",
		"Electronics",
		"Food_Industries",
		"Fuel_Refining",
		"Manufacturing",
		"Metallurgy",
		"Resource_Extraction",
	];

	function calculateWorkforceResult(): Required<
		Record<PlanResult.WORKFORCE_TYPE, PlanResult.WorkforceElement>
	> {
		const result: Record<
			PlanResult.WORKFORCE_TYPE,
			PlanResult.WorkforceElement
		> = Object.fromEntries(
			workforceTypeNames.map((key) => {
				// get current workforce value from planet data
				const dataLuxuries: IPlanDataWorkforce | undefined =
					planet.value.workforce.find((e) => e.type == key);

				return [
					key,
					{
						name: key,
						required: 0,
						capacity: 0,
						left: 0,
						lux1: dataLuxuries ? dataLuxuries.lux1 : true,
						lux2: dataLuxuries ? dataLuxuries.lux2 : true,
						efficiency: 0,
					} as PlanResult.WorkforceElement,
				];
			})
		) as Record<PlanResult.WORKFORCE_TYPE, PlanResult.WorkforceElement>;

		// calculate capacity from infrastructure buildings
		data.value.infrastructure.forEach((infrastructure) => {
			if (infrastructure.amount > 0) {
				const infBuildingData: IBuilding = getBuilding(infrastructure.building);

				// must provide workforce habitation
				if (infBuildingData.Habitation !== null) {
					result.pioneer.capacity +=
						infBuildingData.Habitation.Pioneer * infrastructure.amount;
					result.settler.capacity +=
						infBuildingData.Habitation.Settler * infrastructure.amount;
					result.technician.capacity +=
						infBuildingData.Habitation.Technician * infrastructure.amount;
					result.engineer.capacity +=
						infBuildingData.Habitation.Engineer * infrastructure.amount;
					result.scientist.capacity +=
						infBuildingData.Habitation.Scientist * infrastructure.amount;
				}
			}
		});

		// calculate required workforce from production buildings
		data.value.buildings.forEach((prodBuilding) => {
			if (prodBuilding.amount > 0) {
				const prodBuildingData: IBuilding = getBuilding(prodBuilding.name);

				result.pioneer.required +=
					prodBuildingData.Pioneers * prodBuilding.amount;
				result.settler.required +=
					prodBuildingData.Settlers * prodBuilding.amount;
				result.technician.required +=
					prodBuildingData.Technicians * prodBuilding.amount;
				result.engineer.required +=
					prodBuildingData.Engineers * prodBuilding.amount;
				result.scientist.required +=
					prodBuildingData.Scientists * prodBuilding.amount;
			}
		});

		// calculate satifsfaction and left
		Object.values(result).forEach((workforce) => {
			workforce.efficiency = calculateSatisfaction(
				workforce.capacity,
				workforce.required,
				workforce.lux1,
				workforce.lux2
			);

			workforce.left = workforce.capacity - workforce.required;
		});

		return result;
	}

	function calculateAreaResult(): PlanResult.AreaResult {
		// Core Module holds 25 area
		let areaUsed: number = 25;
		let areaTotal: number = 250 + planet.value.permits * 250;

		// calculate area used based on production and infrastructure buildings
		data.value.infrastructure.forEach((infrastructure) => {
			if (infrastructure.amount > 0) {
				const infBuildingData: IBuilding = getBuilding(infrastructure.building);

				areaUsed += infBuildingData.AreaCost * infrastructure.amount;
			}
		});

		data.value.buildings.forEach((building) => {
			if (building.amount > 0) {
				const prodBuildingData: IBuilding = getBuilding(building.name);

				areaUsed += prodBuildingData.AreaCost * building.amount;
			}
		});

		return {
			permits: planet.value.permits,
			areaUsed: areaUsed,
			areaTotal: areaTotal,
			areaLeft: areaTotal - areaUsed,
		};
	}

	function calculateInfrastructureResult(): PlanResult.InfrastructureRecord {
		const result: PlanResult.InfrastructureRecord = Object.fromEntries(
			infrastructureBuildingNames.map((key) => {
				const currentInf: IPlanDataInfrastructure | undefined =
					data.value.infrastructure.find((e) => e.building === key);

				if (currentInf) {
					return [key, currentInf.amount];
				}
				return [key, 0];
			})
		) as PlanResult.InfrastructureRecord;

		return result;
	}

	function calculateExpertResult(): PlanResult.ExpertRecord {
		const result: PlanResult.ExpertRecord = Object.fromEntries(
			expertNames.map((key) => {
				const currentExpert: IPlanDataExpert | undefined =
					planet.value.experts.find((e) => e.type === key);

				let amount: number = 0;
				let bonus: number = 0;

				if (currentExpert) {
					amount = currentExpert.amount;
					bonus = calculateExpertBonus(amount);
				}

				return [key, { name: key, amount: amount, bonus: bonus }];
			})
		) as PlanResult.ExpertRecord;

		return result;
	}

	function calculateProduction(
		corphq: boolean,
		cogc: PLAN_COGCPROGRAM_TYPE,
		workforce: PlanResult.WorkforceRecord,
		experts: PlanResult.ExpertRecord
	): PlanResult.ProductionResult {
		let buildings: PlanResult.ProductionBuilding[] = [];

		// add buildings from data
		data.value.buildings.forEach((b) => {
			// efficiency calculations
			const buildingData: IBuilding = getBuilding(b.name);

			const { totalEfficiency, elements } = calculateBuildingEfficiency(
				buildingData,
				planetData,
				corphq,
				cogc,
				workforce,
				experts,
				activeEmpire.value
			);

			const activeRecipes: PlanResult.ProductionBuildingRecipe[] = [];
			const buildingRecipes: IRecipe[] = getBuildingRecipes(
				b.name,
				planetData.Resources
			);

			// add currently active recipes
			b.active_recipes.forEach((r) => {
				// go raw to loose Proxy
				const recipeInfo: IRecipe | undefined = toRaw(
					buildingRecipes.find((ar) => ar.RecipeId == r.recipeid)
				);

				if (!recipeInfo) {
					throw new Error(
						`Unable to find recipe info for ${b.name} with recipe id ${r.recipeid}`
					);
				}

				activeRecipes.push({
					recipeId: r.recipeid,
					amount: r.amount,
					dailyShare: 1,
					// time adjusted to efficiency and amount
					time: (recipeInfo.TimeMs * r.amount) / totalEfficiency,
					recipe: { ...recipeInfo, dailyRevenue: 0, roi: 0 },
				});
			});

			// calculate total batchtime and
			const totalBatchTime: number = activeRecipes.reduce(
				(sum, ar) => sum + ar.time,
				0
			);

			// update active recipes timeshare
			activeRecipes.forEach(
				(updateDailyShare) =>
					(updateDailyShare.dailyShare = updateDailyShare.time / totalBatchTime)
			);

			// get recipe options
			const recipeOptions: PlanResult.IRecipeBuildingOption[] =
				getBuildingRecipes(b.name, planetData.Resources).map((br) => {
					return {
						RecipeId: br.RecipeId,
						BuildingTicker: br.BuildingTicker,
						RecipeName: br.RecipeName,
						// Time adjusted to Efficiency
						TimeMs: br.TimeMs / totalEfficiency,
						Inputs: br.Inputs,
						Outputs: br.Outputs,
						dailyRevenue: 0,
						roi: 0,
					};
				});

			const building: PlanResult.ProductionBuilding = {
				name: b.name,
				amount: b.amount,
				activeRecipes: activeRecipes,
				recipeOptions: recipeOptions,
				totalEfficiency: totalEfficiency,
				efficiencyElements: elements,
				totalBatchTime: totalBatchTime,
			};

			buildings.push(building);
		});

		return {
			buildings: buildings,
			materialio: calculateMaterialIO(buildings),
		};
	}

	// handler

	function handleUpdateCorpHQ(value: boolean): void {
		planet.value.corphq = value;
	}

	function handleUpdateCOGC(value: PLAN_COGCPROGRAM_TYPE): void {
		planet.value.cogc = value;
	}

	function handleUpdatePermits(value: number): void {
		data.value.planet.permits = clamp(value, 1, 3);
	}

	function handleUpdateWorkforceLux(
		workforce: PlanResult.WORKFORCE_TYPE,
		luxType: "lux1" | "lux2",
		value: boolean
	): void {
		const workforceData: IPlanDataWorkforce | undefined =
			planet.value.workforce.find((e) => e.type == workforce);

		if (workforceData) {
			if (luxType === "lux1") {
				workforceData.lux1 = value;
			} else {
				workforceData.lux2 = value;
			}
		}
	}

	function handleUpdateExpert(
		expert: PlanResult.EXPERT_TYPE,
		value: number
	): void {
		const expertData: IPlanDataExpert | undefined = planet.value.experts.find(
			(e) => e.type === expert
		);

		if (expertData) {
			expertData.amount = clamp(value, 0, 5);
		}
	}

	function handleUpdateInfrastructure(
		infrastructure: PlanResult.INFRASTRUCTURE_TYPE,
		value: number
	): void {
		const infData: IPlanDataInfrastructure | undefined =
			data.value.infrastructure.find((i) => i.building === infrastructure);

		if (infData) {
			infData.amount = value;
		}
	}

	function handleUpdateBuildingAmount(index: number, value: number): void {
		// validate index
		if (typeof data.value.buildings[index] === "undefined") {
			throw new Error(`Building at index '${index}' does not exist.`);
		}

		data.value.buildings[index].amount = value;
	}

	function handleDeleteBuilding(index: number): void {
		// validate index
		if (typeof data.value.buildings[index] === "undefined") {
			throw new Error(`Building at index '${index}' does not exist.`);
		}

		if (index === 0) {
			data.value.buildings.shift();
		} else {
			data.value.buildings.splice(index, 1);
		}
	}

	function handleCreateBuilding(ticker: string): void {
		// validate building
		const building: IBuilding = getBuilding(ticker);

		data.value.buildings.push({
			name: building.Ticker,
			amount: 1,
			active_recipes: [],
		});
	}

	function handleUpdateBuildingRecipeAmount(
		buildingIndex: number,
		recipeIndex: number,
		value: number
	): void {
		// validate building index
		if (typeof data.value.buildings[buildingIndex] === "undefined") {
			throw new Error(`Building at index '${buildingIndex}' does not exist.`);
		}

		// validate recipe index
		if (
			typeof data.value.buildings[buildingIndex].active_recipes[recipeIndex] ===
			"undefined"
		) {
			throw new Error(
				`Building at index '${buildingIndex}' has no recipe at index '${recipeIndex}.`
			);
		}

		data.value.buildings[buildingIndex].active_recipes[recipeIndex].amount =
			value;
	}

	function handleDeleteBuildingRecipe(
		buildingIndex: number,
		recipeIndex: number
	): void {
		// validate building index
		if (typeof data.value.buildings[buildingIndex] === "undefined") {
			throw new Error(`Building at index '${buildingIndex}' does not exist.`);
		}

		// validate recipe index
		if (
			typeof data.value.buildings[buildingIndex].active_recipes[recipeIndex] ===
			"undefined"
		) {
			throw new Error(
				`Building at index '${buildingIndex}' has no recipe at index '${recipeIndex}.`
			);
		}

		if (recipeIndex === 0) {
			data.value.buildings[buildingIndex].active_recipes.shift();
		} else {
			data.value.buildings[buildingIndex].active_recipes.splice(recipeIndex, 1);
		}
	}

	function handleAddBuildingRecipe(buildingIndex: number): void {
		// validate building index
		if (typeof data.value.buildings[buildingIndex] === "undefined") {
			throw new Error(`Building at index '${buildingIndex}' does not exist.`);
		}

		// ensure the building is also in the result + got recipe options
		if (
			typeof result.value.production.buildings[buildingIndex] === "undefined" ||
			result.value.production.buildings[buildingIndex].recipeOptions.length ===
				0
		) {
			throw new Error(
				`Building at index '${buildingIndex} does not exist or has no recipe options.`
			);
		}

		// add first option to the data
		data.value.buildings[buildingIndex].active_recipes.push({
			recipeid:
				result.value.production.buildings[buildingIndex].recipeOptions[0]
					.RecipeId,
			amount: 1,
		});
	}

	// calculations

	const result: ComputedRef<PlanResult.Result> = computed(() => {
		// pre-calculate individual results
		const bonusResult = {
			corphq: planet.value.corphq,
			cogc: planet.value.cogc,
		};
		const workforceResult: PlanResult.WorkforceRecord =
			calculateWorkforceResult();
		const areaResult: PlanResult.AreaResult = calculateAreaResult();
		const infrastructureResult: PlanResult.InfrastructureRecord =
			calculateInfrastructureResult();
		const expertResult: PlanResult.ExpertRecord = calculateExpertResult();
		const productionResult: PlanResult.ProductionResult = calculateProduction(
			bonusResult.corphq,
			bonusResult.cogc,
			workforceResult,
			expertResult
		);

		// get individual material IOs
		const workforceMaterialIO: PlanResult.MaterialIOMinimal[] =
			calculateWorkforceConsumption(workforceResult);
		const productionMaterialIO: PlanResult.MaterialIOMinimal[] =
			productionResult.materialio;

		// combina and enhance
		const combinedMaterialIOMinimal: PlanResult.MaterialIOMinimal[] =
			combineMaterialIOMinimal([workforceMaterialIO, productionMaterialIO]);
		const materialIOResult: PlanResult.MaterialIO[] = enhanceMaterialIOMinimal(
			combinedMaterialIOMinimal
		);

		// patch-in to full result
		const resultData: PlanResult.Result = {
			bonus: bonusResult,
			workforce: workforceResult,
			area: areaResult,
			infrastructure: infrastructureResult,
			experts: expertResult,
			production: productionResult,
			materialio: materialIOResult,
		};

		return resultData;
	});

	return {
		result,
		activeEmpire,
		// handler
		handleUpdateCorpHQ,
		handleUpdateCOGC,
		handleUpdatePermits,
		handleUpdateWorkforceLux,
		handleUpdateInfrastructure,
		handleUpdateExpert,
		handleUpdateBuildingAmount,
		handleDeleteBuilding,
		handleCreateBuilding,
		handleUpdateBuildingRecipeAmount,
		handleDeleteBuildingRecipe,
		handleAddBuildingRecipe,
	};
}
