// services
import { apiService } from "@/lib/apiService";

// Schemas & Types
import {
	IOptimizeHabitationPayload,
	IOptimizeHabitationResponse,
	OptimizaHabitationPayloadSchema,
	OptimizeHabitationPayloadType,
	OptimizeHabitationResponseSchema,
	OptimizeHabitationResponseType,
} from "@/features/api/schemas/optimize.schemas";

/**
 * Calls the Habitation optimization endpont
 * @author jplacht
 *
 * @export
 * @async
 * @param {IOptimizeHabitationPayload} payload Plan specific payload
 * @returns {Promise<IOptimizeHabitationResponse>} Optimized habitation
 */
export async function callOptimizeHabitation(
	payload: IOptimizeHabitationPayload
): Promise<IOptimizeHabitationResponse> {
	return apiService.post<
		OptimizeHabitationPayloadType,
		OptimizeHabitationResponseType
	>(
		"/optimize/habitation",
		payload,
		OptimizaHabitationPayloadSchema,
		OptimizeHabitationResponseSchema
	);
}
