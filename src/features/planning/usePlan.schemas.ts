import { z } from "zod";

import {
	IPlan,
	IPlanData,
	IPlanDataBuilding,
	IPlanDataBuildingRecipe,
	IPlanDataExpert,
	IPlanDataInfrastructure,
	IPlanDataPlanet,
	IPlanDataWorkforce,
	IPlanEmpire,
	IPlanShare,
	PLAN_COGCPROGRAM_TYPE,
} from "./usePlan.types";
import { PositiveOrZeroNumber } from "@/util/zodValidators";

const PLAN_COGCPROGRAM_TYPE_ENUM = z.enum([
	"---",
	"AGRICULTURE",
	"CHEMISTRY",
	"CONSTRUCTION",
	"ELECTRONICS",
	"FOOD_INDUSTRIES",
	"FUEL_REFINING",
	"MANUFACTURING",
	"METALLURGY",
	"RESOURCE_EXTRACTION",
	"PIONEERS",
	"SETTLERS",
	"TECHNICIANS",
	"ENGINEERS",
	"SCIENTISTS",
]);

const PlanDataExpertSchema: z.ZodType<IPlanDataExpert> = z.object({
	type: z.enum([
		"Agriculture",
		"Chemistry",
		"Construction",
		"Electronics",
		"Food_Industries",
		"Fuel_Refining",
		"Manufacturing",
		"Metallurgy",
		"Resource_Extraction",
	]),
	amount: PositiveOrZeroNumber,
});

const PlanDataWorkforceSchema: z.ZodType<IPlanDataWorkforce> = z.object({
	type: z.enum(["pioneer", "settler", "technician", "engineer", "scientist"]),
	lux1: z.boolean(),
	lux2: z.boolean(),
});

const PlanDataPlanetSchema: z.ZodType<IPlanDataPlanet> = z.object({
	planetid: z.string(),
	permits: z.number().min(1),
	corphq: z.boolean(),
	cogc: z.preprocess(
		(val) => (typeof val === "string" ? val.toUpperCase() : val),
		PLAN_COGCPROGRAM_TYPE_ENUM
	) as z.ZodType<z.infer<typeof PLAN_COGCPROGRAM_TYPE_ENUM>>,
	experts: z.array(PlanDataExpertSchema),
	workforce: z.array(PlanDataWorkforceSchema),
});

const PlanDataInfrastructureSchema: z.ZodType<IPlanDataInfrastructure> =
	z.object({
		building: z.enum([
			"HB1",
			"HB2",
			"HB3",
			"HB4",
			"HB5",
			"HBB",
			"HBC",
			"HBM",
			"HBL",
			"STO",
		]),
		amount: PositiveOrZeroNumber,
	});

const PlanDataBuildingRecipeSchema: z.ZodType<IPlanDataBuildingRecipe> =
	z.object({
		recipeid: z.string(),
		amount: PositiveOrZeroNumber,
	});

const PlanDataBuildingSchema: z.ZodType<IPlanDataBuilding> = z.object({
	name: z.string().min(2).max(3),
	amount: PositiveOrZeroNumber,
	active_recipes: z.array(PlanDataBuildingRecipeSchema),
});

const PlanDataSchema: z.ZodType<IPlanData> = z.object({
	planet: PlanDataPlanetSchema,
	infrastructure: z.array(PlanDataInfrastructureSchema),
	buildings: z.array(PlanDataBuildingSchema),
});

const PLAN_FACTION_TYPE_ZOD_ENUM = z.enum([
	"NONE",
	"ANTARES",
	"BENTEN",
	"HORTUS",
	"MORIA",
	"OUTSIDEREGION",
]);

const PlanEmpireSchema: z.ZodType<IPlanEmpire> = z.object({
	faction: z.preprocess(
		(val) => (typeof val === "string" ? val.toUpperCase() : val),
		PLAN_FACTION_TYPE_ZOD_ENUM
	) as z.ZodType<z.infer<typeof PLAN_FACTION_TYPE_ZOD_ENUM>>,
	permits_used: z.number().min(1),
	permits_total: z.number().min(3),
	uuid: z.string().uuid(),
	name: z.string(),
	use_fio_storage: z.boolean(),
});

export const PlanSchema: z.ZodType<IPlan> = z.object({
	name: z.string(),
	uuid: z.string().uuid(),
	planet_id: z.string(),
	faction: z.preprocess(
		(val) => (typeof val === "string" ? val.toUpperCase() : val),
		PLAN_FACTION_TYPE_ZOD_ENUM
	) as z.ZodType<z.infer<typeof PLAN_FACTION_TYPE_ZOD_ENUM>>,
	permits_used: z.number().min(1),
	permits_total: z.number().min(3),
	override_empire: z.boolean(),
	baseplanner_data: PlanDataSchema,
	empires: z.array(PlanEmpireSchema),
});

export const PlanShareSchema: z.ZodType<IPlanShare> = z.object({
	uuid: z.string().uuid(),
	created_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date string",
	}),
	view_count: PositiveOrZeroNumber,
	baseplanner: PlanSchema,
});

export type PlanSchemaType = z.infer<typeof PlanSchema>;
export type PlanShareSchemaType = z.infer<typeof PlanShareSchema>;
