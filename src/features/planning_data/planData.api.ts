// services
import { apiService } from "@/lib/apiService";

// Schemas & Schema Types
import {
	CXListPayloadSchema,
	CXListPayloadSchemaType,
	PlanEmpireElementPayload,
	PlanEmpireElementPayloadType,
	PlanSchema,
	PlanSchemaType,
	PlanShareSchema,
	PlanShareSchemaType,
} from "@/features/planning_data/planningData.schemas";

// Types & Interfaces
import {
	ICX,
	IPlan,
	IPlanEmpireElement,
	IPlanShare,
} from "@/stores/planningStore.types";

/**
 * Fetches data of a shared plans uuid from the API
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} sharedPlanUuid Shared Plan Uuid
 * @returns {Promise<IPlanShare>} Shared Plan Data
 */
export async function callGetShared(
	sharedPlanUuid: string
): Promise<IPlanShare> {
	return apiService.get<PlanShareSchemaType>(
		`/shared/${sharedPlanUuid}`,
		PlanShareSchema
	);
}

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
 * Gets a plan specified by plan Uuid
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} planUuid Uuid of the plan to fetch
 * @returns {Promise<IPlan>} Plan Data
 */
export async function callGetPlan(planUuid: string): Promise<IPlan> {
	return apiService.get<PlanSchemaType>(`/baseplanner/${planUuid}`, PlanSchema);
}

/**
 * Gets all cx preferences a user has defined
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<ICX[]>} CX Preference Array
 */
export async function callGetCXList(): Promise<ICX[]> {
	return apiService.get<CXListPayloadSchemaType>(`/cx/`, CXListPayloadSchema);
}
