// services
import { apiService } from "@/lib/apiService";

// Schemas & Schema Types
import {
	PlanCreateDataSchema,
	PlanCreateDataType,
	PlanSaveCreateResponseSchema,
	PlanSaveCreateResponseType,
	PlanSaveDataSchema,
	PlanSaveDataType,
	PlanSchema,
	PlanSchemaType,
	PlanShareSchema,
	PlanShareSchemaType,
} from "@/features/planning_data/planningData.schemas";

// Types & Interfaces
import { IPlan, IPlanShare } from "@/stores/planningStore.types";
import {
	IPlanCreateData,
	IPlanSaveData,
} from "@/features/planning_data/usePlan.types";

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
 * Executes a Put request containing a new plans data towards
 * the backend API and returns its response
 * @author jplacht
 *
 * @export
 * @async
 * @param {IPlanCreateData} data Plan data to be created
 * @returns {Promise<PlanSaveCreateResponseType>}  Plan Uuid
 */
export async function callCreatePlan(
	data: IPlanCreateData
): Promise<PlanSaveCreateResponseType> {
	return apiService.put<PlanCreateDataType, PlanSaveCreateResponseType>(
		"/baseplanner/",
		data,
		PlanCreateDataSchema,
		PlanSaveCreateResponseSchema
	);
}

/**
 * Executes a Patch request containing an existing plans updated
 * planning data towards backend and returns its response
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} planUuid Plan Uuid
 * @param {IPlanSaveData} data Plan Data to be stored
 * @returns {Promise<PlanSaveCreateResponseType>} Plan Uuid
 */
export async function callSavePlan(
	planUuid: string,
	data: IPlanSaveData
): Promise<PlanSaveCreateResponseType> {
	return apiService.patch<PlanSaveDataType, PlanSaveCreateResponseType>(
		`/baseplanner/${planUuid}`,
		data,
		PlanSaveDataSchema,
		PlanSaveCreateResponseSchema
	);
}
