// API
import { callGetShared } from "@/features/planning_data/planData.api";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";
import { usePlanningStore } from "@/stores/planningStore";

// Typees & Interfaces
import { IPlanRouteParams } from "@/features/planning_data/usePlan.types";

import { PlanLoadError } from "@/features/planning_data/usePlan.errors";
import {
	IPlanet,
	PLANET_COGCPROGRAM_TYPE,
} from "@/features/game_data/gameData.types";
import {
	IPlan,
	IPlanEmpireElement,
	IPlanLoadData,
	IPlanShare,
	PLAN_COGCPROGRAM_TYPE,
} from "@/stores/planningStore.types";

export function usePlan() {
	const gameDataStore = useGameDataStore();
	const planningStore = usePlanningStore();

	/**
	 * Loads a plan definition from given route parameters
	 * for either a new plan, an existing plan or using data
	 * from a shared plan uuid.
	 *
	 * @author jplacht
	 *
	 * @async
	 * @param {IPlanRouteParams} routeParams Route Parameters
	 * @returns {Promise<IPlan>} Plan Definition
	 */
	async function loadDefinitionFromRouteParams(
		routeParams: IPlanRouteParams
	): Promise<IPlanLoadData> {
		// shared plan, only shared uuid given
		if (routeParams.sharedPlanUuid) {
			const planData: IPlanShare = await callGetShared(
				routeParams.sharedPlanUuid
			);

			// ensure planet is loaded

			const sharePlanetLoadResult: boolean =
				await gameDataStore.performLoadPlanet(planData.baseplanner.planet_id);

			if (!sharePlanetLoadResult) {
				throw new PlanLoadError("PLANET_FAILURE", "Error loading planet data.");
			}

			return {
				planData: planData.baseplanner,
				empires: [],
			};
		}

		// other routes must have the planets natural id in url
		if (!routeParams.planetNaturalId) {
			throw new PlanLoadError(
				"MISSING_PLANET_ID",
				"PlanetNaturalId is required to obtain plan data."
			);
		} else {
			// Load Planet Data

			let planet: IPlanet | undefined = undefined;

			try {
				planet = await gameDataStore.getPlanet(routeParams.planetNaturalId);
			} catch {
				throw new PlanLoadError("PLANET_FAILURE", "Error loading planet data.");
			}

			// Load Empire Data

			const empireData: IPlanEmpireElement[] =
				await planningStore.getAllEmpires();

			// if no plan uuid is present, create a blank definition
			if (!routeParams.planUuid) {
				return {
					planData: createBlankDefinition(
						routeParams.planetNaturalId,
						planet.COGCProgramActive
					),
					empires: empireData,
				};
			}

			// plan uuid is present, use the existing plan data
			try {
				const planData: IPlan = await planningStore.getPlan(
					routeParams.planUuid
				);

				return {
					planData: planData,
					empires: empireData,
				};
			} catch (err) {
				console.error(err);
				throw new PlanLoadError(
					"API_FAILURE",
					"Failed to load plan data from API"
				);
			}
		}
	}

	/**
	 * Checks if route parameters contain the uuid of a
	 * shared plan, if so the whole plan is read-only
	 *
	 * @author jplacht
	 *
	 * @param {IPlanRouteParams} routeParams Route Parameters
	 * @returns {boolean} True if shared uuid is present
	 */
	function isEditDisabled(routeParams: IPlanRouteParams): boolean {
		if (routeParams.sharedPlanUuid) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Maps planets COGC Program Type to Plans COGC Program Type
	 *
	 * @author jplacht
	 *
	 * @param {(PLANET_COGCPROGRAM_TYPE | null | undefined)} input Planet COGC Type
	 * @returns {PLAN_COGCPROGRAM_TYPE} Plan COGC Type
	 */
	function mapPlanetToPlanType(
		input: PLANET_COGCPROGRAM_TYPE | null | undefined
	): PLAN_COGCPROGRAM_TYPE {
		if (!input) return "---";
		const parts = input.split("_");
		return parts.slice(1).join("_").toUpperCase() as PLAN_COGCPROGRAM_TYPE;
	}

	/**
	 * Generates a new plan definition from Planet Natural Id
	 *
	 * @author jplacht
	 *
	 * @param {string} planetNaturalId Planet Natural Id (e.g. 'OT-580b')
	 * @param {(PLANET_COGCPROGRAM_TYPE | null)} cogc Planet COGC
	 * @returns {IPlan} Blank plan definition
	 */
	function createBlankDefinition(
		planetNaturalId: string,
		cogc: PLANET_COGCPROGRAM_TYPE | null
	): IPlan {
		return {
			name: undefined,
			uuid: undefined,
			planet_id: planetNaturalId,
			faction: "NONE",
			permits_used: 1,
			permits_total: 3,
			override_empire: false,
			baseplanner_data: {
				planet: {
					planetid: planetNaturalId,
					permits: 1,
					corphq: false,
					cogc: mapPlanetToPlanType(cogc),
					experts: [
						{
							type: "Agriculture",
							amount: 0,
						},
						{
							type: "Chemistry",
							amount: 0,
						},
						{
							type: "Construction",
							amount: 0,
						},
						{
							type: "Electronics",
							amount: 0,
						},
						{
							type: "Food_Industries",
							amount: 0,
						},
						{
							type: "Fuel_Refining",
							amount: 0,
						},
						{
							type: "Manufacturing",
							amount: 0,
						},
						{
							type: "Metallurgy",
							amount: 0,
						},
						{
							type: "Resource_Extraction",
							amount: 0,
						},
					],
					workforce: [
						{
							type: "pioneer",
							lux1: true,
							lux2: true,
						},
						{
							type: "settler",
							lux1: true,
							lux2: true,
						},
						{
							type: "technician",
							lux1: true,
							lux2: true,
						},
						{
							type: "engineer",
							lux1: true,
							lux2: true,
						},
						{
							type: "scientist",
							lux1: true,
							lux2: true,
						},
					],
				},
				infrastructure: [],
				buildings: [],
			},
			empires: [],
		};
	}

	return {
		loadDefinitionFromRouteParams,
		isEditDisabled,
		mapPlanetToPlanType,
		createBlankDefinition,
	};
}
