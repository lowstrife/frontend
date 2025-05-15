import { z } from "zod";

// Types & Interfaces
import { PLAN_FACTION_TYPE_ZOD_ENUM } from "@/features/planning_data/planningData.schemas";
import { IEmpirePatchPayload } from "@/features/empire/empire.types";

export const EmpirePatchPayload: z.ZodType<IEmpirePatchPayload> = z.object({
	faction: z.preprocess(
		(val) => (typeof val === "string" ? val.toUpperCase() : val),
		PLAN_FACTION_TYPE_ZOD_ENUM
	) as z.ZodType<z.infer<typeof PLAN_FACTION_TYPE_ZOD_ENUM>>,
	permits_used: z.number().int().min(1),
	permits_total: z.number().int().min(2),
	name: z.string(),
	use_fio_storage: z.boolean(),
});

export type EmpirePatchPayloadType = z.infer<typeof EmpirePatchPayload>;
