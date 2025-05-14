import { computed, ComputedRef, ref, Ref, toRaw, toRef } from "vue";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Composables
import { useBuildingData } from "@/features/game_data/useBuildingData";
import { useBuildingCalculation } from "@/features/planning/calculations/buildingCalculations";
import { useMaterialIOUtil } from "@/features/planning/util/materialIO.util";
import { usePrice } from "@/features/cx/usePrice";

// Calculation Utils
import {
	expertNames,
	useBonusCalculation,
} from "@/features/planning/calculations/bonusCalculations";
import {
	infrastructureBuildingNames,
	useWorkforceCalculation,
	workforceTypeNames,
} from "@/features/planning/calculations/workforceCalculations";

// Submodule composables
import { usePlanCalculationHandlers } from "@/features/planning/usePlanCalculationHandlers";
import { usePlanCalculationPreComputes } from "@/features/planning/usePlanCalculationPreComputes";

// Types & Interfaces
import {
	IBuilding,
	IPlanet,
	IRecipe,
} from "@/features/game_data/gameData.types";
import {
	EXPERT_TYPE,
	IAreaResult,
	IExpertRecord,
	IInfrastructureRecord,
	IMaterialIO,
	IMaterialIOMaterial,
	IMaterialIOMinimal,
	INFRASTRUCTURE_TYPE,
	IPlanResult,
	IProductionBuilding,
	IProductionBuildingRecipe,
	IProductionResult,
	IRecipeBuildingOption,
	IWorkforceElement,
	IWorkforceRecord,
	WORKFORCE_TYPE,
} from "@/features/planning/usePlanCalculation.types";
import {
	IPlan,
	IPlanData,
	IPlanDataBuilding,
	IPlanDataExpert,
	IPlanDataInfrastructure,
	IPlanDataPlanet,
	IPlanDataWorkforce,
	IPlanEmpire,
	IPlanEmpireElement,
	PLAN_COGCPROGRAM_TYPE,
} from "@/stores/planningStore.types";
import { IPlanCreateData } from "@/features/planning_data/usePlan.types";

export function usePlanCalculation(
	plan: Ref<IPlan>,
	empireUuid: Ref<string | undefined> = ref(undefined),
	empireOptions: Ref<IPlanEmpireElement[] | undefined> = ref(undefined),
	cxUuid: Ref<string | undefined> = ref(undefined)
) {
	// stores

	const gameDataStore = useGameDataStore();

	// data references

	const planName: Ref<string | undefined> = toRef(plan.value.name);
	const data: ComputedRef<IPlanData> = computed(
		() => plan.value.baseplanner_data
	);
	const planet: ComputedRef<IPlanDataPlanet> = computed(
		() => data.value.planet
	);
	const planetNaturalId: ComputedRef<string> = computed(
		() => data.value.planet.planetid
	);
	const empires: Ref<IPlanEmpire[]> = toRef([]);
	const planEmpires: ComputedRef<IPlanEmpire[]> = computed(
		() => plan.value.empires
	);
	const planetData: IPlanet = gameDataStore.planets[planet.value.planetid];
	const buildings: ComputedRef<IPlanDataBuilding[]> = computed(
		() => data.value.buildings
	);

	// composables

	const { getBuilding } = useBuildingData();
	const { combineMaterialIOMinimal, enhanceMaterialIOMinimal } =
		useMaterialIOUtil();
	const { calculateExpertBonus, calculateBuildingEfficiency } =
		useBonusCalculation();
	const { calculateSatisfaction, calculateWorkforceConsumption } =
		useWorkforceCalculation();
	const { getMaterialIOTotalPrice, enhanceMaterialIOMaterial } = usePrice(
		cxUuid,
		planetNaturalId
	);
	const { calculateMaterialIO } = useBuildingCalculation();

	// computations

	const existing: ComputedRef<boolean> = computed(() => {
		return plan.value.uuid !== undefined;
	});

	const saveable: ComputedRef<boolean> = computed(() => {
		return planName.value != undefined;
	});

	// pre-computations

	const { computedActiveEmpire, computedBuildingInformation } =
		usePlanCalculationPreComputes(
			buildings,
			cxUuid,
			empireUuid,
			empireOptions,
			planetNaturalId,
			planetData
		);

	// calculations

	/**
	 * Calculates plan workforce based on infrastructure provisioning and
	 * production building needs. This also includes the efficiency calculation
	 * based on capacity and required workforce under given luxury provision.
	 *
	 * @author jplacht
	 *
	 * @returns {Required<
	 * 		Record<WORKFORCE_TYPE, IWorkforceElement>
	 * 	>} Calculated Workforce Result
	 */
	function calculateWorkforceResult(): Required<
		Record<WORKFORCE_TYPE, IWorkforceElement>
	> {
		const result: Record<WORKFORCE_TYPE, IWorkforceElement> =
			Object.fromEntries(
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
						} as IWorkforceElement,
					];
				})
			) as Record<WORKFORCE_TYPE, IWorkforceElement>;

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

	/**
	 * Calculates the plans area result by determining the total amount of
	 * usable area based on permits and the used area by infrastructure
	 * and production buildings. C
	 *
	 * @remark Core Modul Area of 25 is always included
	 *
	 * @author jplacht
	 *
	 * @returns {IAreaResult} Plan Area Result
	 */
	function calculateAreaResult(): IAreaResult {
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

	/**
	 * Calculates a result record with all infrastructure buildings and
	 * their currently used amount in the plan
	 *
	 * @author jplacht
	 *
	 * @returns {IInfrastructureRecord} Infrastructure Record
	 */
	function calculateInfrastructureResult(): IInfrastructureRecord {
		const result: IInfrastructureRecord = Object.fromEntries(
			infrastructureBuildingNames.map((key) => {
				const currentInf: IPlanDataInfrastructure | undefined =
					data.value.infrastructure.find((e) => e.building === key);

				if (currentInf) {
					return [key, currentInf.amount];
				}
				return [key, 0];
			})
		) as IInfrastructureRecord;

		return result;
	}

	/**
	 * Calculates the result for expert setup of the plan returning a
	 * record with each expert type, its planned amount and the bonus
	 * efficiency provided by it
	 *
	 * @author jplacht
	 *
	 * @returns {IExpertRecord} Expert Result Record
	 */
	function calculateExpertResult(): IExpertRecord {
		const result: IExpertRecord = Object.fromEntries(
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
		) as IExpertRecord;

		return result;
	}

	/**
	 * Calculates plan production taking into account efficiency factors
	 * for certain production lines, buildings, experts and workforce
	 * based on the plans active recipes
	 *
	 * @author jplacht
	 *
	 * @param {boolean} corphq Has CORPHQ on planet
	 * @param {PLAN_COGCPROGRAM_TYPE} cogc COGC value
	 * @param {IWorkforceRecord} workforce Workforce result
	 * @param {IExpertRecord} experts Plans experts
	 * @returns {IProductionResult} Production Result
	 */
	function calculateProduction(
		corphq: boolean,
		cogc: PLAN_COGCPROGRAM_TYPE,
		workforce: IWorkforceRecord,
		experts: IExpertRecord
	): IProductionResult {
		let buildings: IProductionBuilding[] = [];

		// add buildings from data
		data.value.buildings.forEach((b) => {
			// efficiency calculations
			const buildingData: IBuilding =
				computedBuildingInformation.value[b.name].buildingData;

			const { totalEfficiency, elements } = calculateBuildingEfficiency(
				buildingData,
				planetData,
				corphq,
				cogc,
				workforce,
				experts,
				computedActiveEmpire.value
			);

			const activeRecipes: IProductionBuildingRecipe[] = [];
			const buildingRecipes: IRecipe[] =
				computedBuildingInformation.value[b.name].buildingRecipes;

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

			// get construction materials
			const constructionMaterials: IMaterialIOMinimal[] =
				computedBuildingInformation.value[b.name].constructionMaterials;

			// calculate construction costs
			const constructionCost: number =
				computedBuildingInformation.value[b.name].constructionCost;

			const workforceMaterials: IMaterialIOMinimal[] =
				computedBuildingInformation.value[b.name].workforceMaterials;
			const workforceDailyCost: number = getMaterialIOTotalPrice(
				workforceMaterials,
				"BUY"
			);

			// get recipe options
			const recipeOptions: IRecipeBuildingOption[] = buildingRecipes.map(
				(br) => {
					// calculate daily revenue
					// output revenue
					const dailyIncome: number = getMaterialIOTotalPrice(
						br.Outputs.map((o) => {
							return { ticker: o.Ticker, output: o.Amount, input: 0 };
						}),
						"SELL"
					);
					// input cost
					const dailyCost: number = getMaterialIOTotalPrice(
						br.Inputs.map((i) => {
							return { ticker: i.Ticker, output: 0, input: i.Amount };
						}),
						"SELL"
					);

					/**
					 * Daily Revenue of a recipe option:
					 *
					 * 	= Daily Income (selling recipe outputs)
					 * 	- Daily Cost (buying recipe inputs)
					 * 	- Building Degradation (1/180 of construction cost)
					 * 	- Building Daily Workforce Cost (lux1 + lux2)
					 */

					const dailyRevenue: number =
						dailyIncome -
						dailyCost -
						constructionCost * -1 * (1 / 180) -
						-1 * workforceDailyCost;

					/**
					 * Recipe option ROI
					 *
					 * Time it takes for the recipes daily revenue to offset
					 * the total construction cost of this building
					 */
					const roi: number = (constructionCost * -1) / dailyRevenue;

					return {
						RecipeId: br.RecipeId,
						BuildingTicker: br.BuildingTicker,
						RecipeName: br.RecipeName,
						// Time adjusted to Efficiency
						TimeMs: br.TimeMs / totalEfficiency,
						Inputs: br.Inputs,
						Outputs: br.Outputs,
						dailyRevenue: dailyRevenue,
						roi: roi,
					};
				}
			);

			const building: IProductionBuilding = {
				name: b.name,
				amount: b.amount,
				activeRecipes: activeRecipes,
				recipeOptions: recipeOptions,
				totalEfficiency: totalEfficiency,
				efficiencyElements: elements,
				totalBatchTime: totalBatchTime,
				constructionMaterials: constructionMaterials,
				constructionCost: constructionCost,
				workforceMaterials: workforceMaterials,
				workforceDailyCost: workforceDailyCost,
			};

			buildings.push(building);
		});

		return {
			buildings: buildings,
			materialio: calculateMaterialIO(buildings),
		};
	}

	// result composing

	/**
	 * Combines all result calculations into a single result definition
	 * while also applying enhancements to data (e.g. prices on Material IO)
	 * and structures for further use.
	 *
	 * @author jplacht
	 *
	 * @type {ComputedRef<IPlanResult>} Plan Calculation Result
	 */
	const result: ComputedRef<IPlanResult> = computed(() => {
		// pre-calculate individual results
		const corpHQResult = planet.value.corphq;
		const cogcResult = planet.value.cogc;

		const workforceResult: IWorkforceRecord = calculateWorkforceResult();
		const areaResult: IAreaResult = calculateAreaResult();
		const infrastructureResult: IInfrastructureRecord =
			calculateInfrastructureResult();
		const expertResult: IExpertRecord = calculateExpertResult();
		const productionResult: IProductionResult = calculateProduction(
			corpHQResult,
			cogcResult,
			workforceResult,
			expertResult
		);

		// get individual material IOs
		const workforceMaterialIO: IMaterialIOMinimal[] =
			calculateWorkforceConsumption(workforceResult);
		const productionMaterialIO: IMaterialIOMinimal[] =
			productionResult.materialio;

		// combine and enhance
		const combinedMaterialIOMinimal: IMaterialIOMinimal[] =
			combineMaterialIOMinimal([workforceMaterialIO, productionMaterialIO]);
		const materialIOMaterial: IMaterialIOMaterial[] = enhanceMaterialIOMinimal(
			combinedMaterialIOMinimal
		);
		const materialIO: IMaterialIO[] =
			enhanceMaterialIOMaterial(materialIOMaterial);

		// patch-in to full result
		const resultData: IPlanResult = {
			corphq: corpHQResult,
			cogc: cogcResult,
			workforce: workforceResult,
			area: areaResult,
			infrastructure: infrastructureResult,
			experts: expertResult,
			production: productionResult,
			materialio: materialIO,
			workforceMaterialIO: enhanceMaterialIOMaterial(
				enhanceMaterialIOMinimal(workforceMaterialIO)
			),
			productionMaterialIO: enhanceMaterialIOMaterial(
				enhanceMaterialIOMinimal(productionMaterialIO)
			),
		};

		return resultData;
	});

	// backend data
	const backendData: ComputedRef<IPlanCreateData> = computed(() => {
		return {
			name: planName.value ?? "missing name",
			planet_id: planet.value.planetid,
			faction: "NONE",
			override_empire: false,
			permits_used: 1,
			permits_total: 3,
			planet: planet.value,
			infrastructure: data.value.infrastructure,
			buildings: data.value.buildings,
			empire_uuid: empireUuid.value,
		};
	});

	// submodules
	const handlers = usePlanCalculationHandlers(planet, data, planName, result);

	return {
		existing,
		saveable,
		result,
		empires,
		backendData,
		planEmpires,
		planName,
		// precomputes
		computedActiveEmpire,
		// submodules
		...handlers,
	};
}
