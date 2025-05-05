import {
	BUILDING_EXPERTISE_TYPE,
	IBuilding,
	IPlanet,
} from "@/features/game_data/gameData.types";
import { EfficiencyMap, IBuildingEfficiency } from "./bonusCalculations.types";
import { IPlanEmpire, PLAN_COGCPROGRAM_TYPE } from "../usePlan.types";
import { PlanResult } from "../usePlanCalculation.types";
import { useBuildingData } from "@/features/game_data/useBuildingData";

const { getTotalWorkforce } = useBuildingData();

/**
 * Static, map of building expertise and plan calculation
 * result expert assignments
 * @author jplacht
 *
 * @type {Record<
 * 	BUILDING_EXPERTISE_TYPE,
 * 	PlanResult.EXPERT_TYPE
 * >}
 */
const MAP_BUILDING_EXPERTISE_EXPERTS: Record<
	BUILDING_EXPERTISE_TYPE,
	PlanResult.EXPERT_TYPE
> = {
	AGRICULTURE: "Agriculture",
	CHEMISTRY: "Chemistry",
	CONSTRUCTION: "Construction",
	ELECTRONICS: "Electronics",
	FOOD_INDUSTRIES: "Food_Industries",
	FUEL_REFINING: "Fuel_Refining",
	MANUFACTURING: "Manufacturing",
	METALLURGY: "Metallurgy",
	RESOURCE_EXTRACTION: "Resource_Extraction",
};

/**
 * Static, ingame map of Factions and their building
 * expertise bonuses
 * @author jplacht
 *
 * @type {EfficiencyMap}
 */
const FACTION_BONUS_MAP: EfficiencyMap = {
	ANTARES: {
		ELECTRONICS: 0.05,
	},
	BENTEN: {
		MANUFACTURING: 0.5,
	},
	HORTUS: {
		AGRICULTURE: 0.03,
		FOOD_INDUSTRIES: 0.02,
	},
	MORIA: {
		METALLURGY: 0.02,
		CONSTRUCTION: 0.03,
	},
	OUTSIDEREGION: {
		CHEMISTRY: 0.02,
		FUEL_REFINING: 0.02,
		RESOURCE_EXTRACTION: 0.02,
	},
};

/**
 * Static, ingame expert bonus values
 * @author jplacht
 *
 * @type {Record<number, number>}
 */
const expertBonus: Record<number, number> = {
	0: 0,
	1: 0.0306,
	2: 0.0696,
	3: 0.1248,
	4: 0.1974,
	5: 0.284,
};

/**
 * Returns the expert bonus value on given expert amount.
 * Will return 0 if an out-of-range expert amount (0-5) passed.
 * @author jplacht
 *
 * @export
 * @param {number} amount Expert Amount
 * @returns {number} Expert Bonus
 */
export function calculateExpertBonus(amount: number): number {
	if (Object.keys(expertBonus).includes(amount.toString())) {
		return expertBonus[amount];
	}

	return 0;
}

export function calculateBuildingWorkforceEfficiency(
	building: IBuilding,
	workforce: PlanResult.WorkforceRecord
): number {
	const totalWorkforce: number = getTotalWorkforce(building);
	let efficiency: number = 0;

	efficiency +=
		(building.Pioneers / totalWorkforce) * workforce.pioneer.efficiency;
	efficiency +=
		(building.Settlers / totalWorkforce) * workforce.settler.efficiency;
	efficiency +=
		(building.Technicians / totalWorkforce) * workforce.technician.efficiency;
	efficiency +=
		(building.Engineers / totalWorkforce) * workforce.engineer.efficiency;
	efficiency +=
		(building.Scientists / totalWorkforce) * workforce.scientist.efficiency;

	return efficiency;
}

export function calculateBuildingFactionBonus(
	building: IBuilding,
	empire: IPlanEmpire | undefined
): IBuildingEfficiency | undefined {
	if (!empire || building.Expertise === null) return undefined;

	const multiplier: number =
		2 * (-2 * (empire.permits_used / empire.permits_total) + 3);

	const efficiency: number | undefined =
		FACTION_BONUS_MAP[empire.faction]?.[building.Expertise];

	if (!efficiency) return undefined;

	return {
		efficiencyType: "FACTION",
		value: 1 + efficiency * multiplier,
	};
}

export function calculateBuildingEfficiency(
	building: IBuilding,
	planet: IPlanet,
	corphq: boolean,
	cogc: PLAN_COGCPROGRAM_TYPE,
	workforce: PlanResult.WorkforceRecord,
	experts: PlanResult.ExpertRecord,
	empire: IPlanEmpire | undefined
): {
	totalEfficiency: number;
	elements: IBuildingEfficiency[];
} {
	let elements: IBuildingEfficiency[] = [];

	// fertility on farming buildings
	if (["FRM", "ORC"].includes(building.Ticker)) {
		elements.push({
			efficiencyType: "FERTILITY",
			value: planet.Fertility != -1 ? (1 + planet.Fertility) * (10 / 33) : 0,
		});
	}

	// corporation HQ
	if (corphq) {
		elements.push({
			efficiencyType: "HQ",
			value: 1.1,
		});
	}

	// Expert + COGC
	if (building.Expertise !== null) {
		// COGC on programs
		if (cogc === building.Expertise) {
			elements.push({
				efficiencyType: "COGC",
				value: 1.25,
			});
		}

		const expertElement: PlanResult.ExpertElement =
			experts[MAP_BUILDING_EXPERTISE_EXPERTS[building.Expertise]];

		if (expertElement.amount > 0) {
			elements.push({
				efficiencyType: "EXPERT",
				value: 1 + expertElement.bonus,
			});
		}
	}

	// workforce
	elements.push({
		efficiencyType: "WORKFORCE",
		value: calculateBuildingWorkforceEfficiency(building, workforce),
	});

	// faction bonus
	const factionEfficiency: IBuildingEfficiency | undefined =
		calculateBuildingFactionBonus(building, empire);

	if (factionEfficiency) {
		elements.push(factionEfficiency);
	}

	// total efficiency is the product of all individual
	// efficiency factors this building has

	const totalEfficiency: number = elements.reduce(
		(result, e) => result * e.value,
		1
	);

	return { totalEfficiency, elements };
}
