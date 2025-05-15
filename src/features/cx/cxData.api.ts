// services
import { apiService } from "@/lib/apiService";

// Schemas & Schema Types
import {
	CXListPayloadSchema,
	CXListPayloadSchemaType,
} from "@/features/planning_data/planningData.schemas";

// Types & Interfaces
import { ICX } from "@/stores/planningStore.types";

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
