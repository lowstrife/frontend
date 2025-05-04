import { computed, ComputedRef, Ref, toRef } from "vue";

// Composables
import { useBuildingData } from "@/features/game_data/useBuildingData";

// Util
import { clamp } from "@/util/numbers";

// Calculations
import { calculateSatisfaction } from "@/features/planning/calculations/workforceCalculations";
import { calculateExpertBonus } from "@/features/planning/calculations/bonusCalculations";

// Types & Interfaces
import { PlanResult } from "@/features/planning/usePlanCalculation.types";
import {
	IPlan,
	IPlanData,
	IPlanDataExpert,
	IPlanDataInfrastructure,
	IPlanDataPlanet,
	IPlanDataWorkforce,
	PLAN_COGCPROGRAM_TYPE,
} from "@/features/planning/usePlan.types";
import { IBuilding } from "@/features/game_data/gameData.types";

export function usePlanCalculation(plan: Ref<IPlan>) {
	const data: Ref<IPlanData> = toRef(plan.value.baseplanner_data);
	const planet: Ref<IPlanDataPlanet> = toRef(data.value.planet);

	// composables
	const { getBuilding } = useBuildingData();

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

	const result: ComputedRef<PlanResult.Result> = computed(() => {
		// pre-calculate individual results
		const workforceResult = calculateWorkforceResult();
		const areaResult = calculateAreaResult();
		const infrastructureResult = calculateInfrastructureResult();
		const expertResult = calculateExpertResult();

		return {
			bonus: {
				corphq: planet.value.corphq,
				cogc: planet.value.cogc,
			},
			workforce: workforceResult,
			area: areaResult,
			infrastructure: infrastructureResult,
			experts: expertResult,
		};
	});

	return {
		result,
		// handler
		handleUpdateCorpHQ,
		handleUpdateCOGC,
		handleUpdatePermits,
		handleUpdateWorkforceLux,
		handleUpdateInfrastructure,
		handleUpdateExpert,
	};
}
