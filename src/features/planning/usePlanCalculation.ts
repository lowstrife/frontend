import { computed, ComputedRef, Ref, toRef } from "vue";

// Composables
import { useBuildingData } from "@/features/game_data/useBuildingData";

// Util
import { clamp } from "@/util/numbers";

// Types & Interfaces
import { PlanResult } from "@/features/planning/usePlanCalculation.types";
import {
	IPlan,
	IPlanData,
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

	const result: ComputedRef<PlanResult.Result> = computed(() => {
		return {
			bonus: {
				corphq: planet.value.corphq,
				cogc: planet.value.cogc,
			},
			workforce: calculateWorkforceResult(),
			area: calculateAreaResult(),
		};
	});

	return {
		result,
		// handler
		handleUpdateCorpHQ,
		handleUpdateCOGC,
		handleUpdatePermits,
	};
}
