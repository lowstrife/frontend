// services
import { apiService } from "@/lib/apiService";

// Schemas & Schema Types
import {
	PlanEmpireElementPayload,
	PlanEmpireElementPayloadType,
	PlanEmpirePlanListPayload,
	PlanEmpirePlanListType,
	PlanEmpireSchema,
	PlanEmpireSchemaType,
} from "@/features/planning_data/planningData.schemas";

// Types & Interfaces
import {
	IPlan,
	IPlanEmpire,
	IPlanEmpireElement,
} from "@/stores/planningStore.types";
import {
	EmpirePatchPayload,
	EmpirePatchPayloadType,
} from "./empireData.schemas";
import { IEmpirePatchPayload } from "./empire.types";

/**
 * Gets all empires a user has defined
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<IPlanEmpireElement[]>} User Empire Array
 */
export async function callGetEmpireList(): Promise<IPlanEmpireElement[]> {
	return apiService.get<PlanEmpireElementPayloadType>(
		`/empire/`,
		PlanEmpireElementPayload
	);
}

/**
 * Gets all plans in a users empire
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} empireUuid Empire Uuid
 * @returns {Promise<IPlan[]>} List of plans in specified empire
 */
export async function callGetEmpirePlans(empireUuid: string): Promise<IPlan[]> {
	return apiService.get<PlanEmpirePlanListType>(
		`/baseplanner/empire/${empireUuid}`,
		PlanEmpirePlanListPayload
	);
}

/**
 * Updates data for specific empire
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} empireUuid Empire Uuid
 * @param {IEmpirePatchPayload} data Empire Patch data
 * @returns {Promise<IPlanEmpire>} Updated empire data
 */
export async function callPatchEmpire(
	empireUuid: string,
	data: IEmpirePatchPayload
): Promise<IPlanEmpire> {
	return apiService.patch<EmpirePatchPayloadType, PlanEmpireSchemaType>(
		`/empire/${empireUuid}`,
		data,
		EmpirePatchPayload,
		PlanEmpireSchema
	);
}
