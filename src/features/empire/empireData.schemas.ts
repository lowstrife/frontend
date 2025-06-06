import { z } from "zod";

// Types & Interfaces
import { PLAN_FACTION_TYPE_ZOD_ENUM } from "@/features/planning_data/planningData.schemas";
import { IEmpirePatchPayload } from "@/features/empire/empire.types";
import { IPlanEmpireJunction } from "@/features/manage/manage.types";

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

export const EmpireCreatePayload = EmpirePatchPayload;

export type EmpirePatchPayloadType = z.infer<typeof EmpirePatchPayload>;
export type EmpireCreatePayloadType = z.infer<typeof EmpireCreatePayload>;

export const EmpireJunctionSchema: z.ZodType<IPlanEmpireJunction> = z.object({
	empire_uuid: z.string().uuid(),
	baseplanners: z.array(z.object({ baseplanner_uuid: z.string().uuid() })),
});

export const EmpireJunctionPayloadSchema = z.array(EmpireJunctionSchema);
export type EmpireJunctionPayloadType = z.infer<
	typeof EmpireJunctionPayloadSchema
>;
