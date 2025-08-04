import { PositiveOrZeroNumber } from "@/util/zodValidators";
import z from "zod";

export interface IOptimizeHabitationPayload {
	pioneer: number;
	settler: number;
	technician: number;
	engineer: number;
	scientist: number;
	cost_HBB: number;
	cost_HBC: number;
	cost_HBM: number;
	cost_HBL: number;
	cost_HB1: number;
	cost_HB2: number;
	cost_HB3: number;
	cost_HB4: number;
	cost_HB5: number;
}

interface IOptimizeHabitationResponsePart {
	HBB: number;
	HBC: number;
	HBM: number;
	HBL: number;
	HB1: number;
	HB2: number;
	HB3: number;
	HB4: number;
	HB5: number;
	min_area: number;
	min_cost: number;
	cost_area: number;

	[key: string]: number;
}

export interface IOptimizeHabitationResponse {
	optimize_area: IOptimizeHabitationResponsePart;
	optimize_cost: IOptimizeHabitationResponsePart;
	difference_area: number;
	difference_cost: number;
	difference_cost_area: number;
}

export const OptimizaHabitationPayloadSchema: z.ZodType<IOptimizeHabitationPayload> =
	z.object({
		pioneer: PositiveOrZeroNumber,
		settler: PositiveOrZeroNumber,
		technician: PositiveOrZeroNumber,
		engineer: PositiveOrZeroNumber,
		scientist: PositiveOrZeroNumber,
		cost_HBB: PositiveOrZeroNumber,
		cost_HBC: PositiveOrZeroNumber,
		cost_HBM: PositiveOrZeroNumber,
		cost_HBL: PositiveOrZeroNumber,
		cost_HB1: PositiveOrZeroNumber,
		cost_HB2: PositiveOrZeroNumber,
		cost_HB3: PositiveOrZeroNumber,
		cost_HB4: PositiveOrZeroNumber,
		cost_HB5: PositiveOrZeroNumber,
	});

const OptimizeHabitationResponsePartSchema: z.ZodType<IOptimizeHabitationResponsePart> =
	z.object({
		HBB: PositiveOrZeroNumber,
		HBC: PositiveOrZeroNumber,
		HBM: PositiveOrZeroNumber,
		HBL: PositiveOrZeroNumber,
		HB1: PositiveOrZeroNumber,
		HB2: PositiveOrZeroNumber,
		HB3: PositiveOrZeroNumber,
		HB4: PositiveOrZeroNumber,
		HB5: PositiveOrZeroNumber,
		min_area: PositiveOrZeroNumber,
		min_cost: PositiveOrZeroNumber,
		cost_area: PositiveOrZeroNumber,
	});

export const OptimizeHabitationResponseSchema: z.ZodType<IOptimizeHabitationResponse> =
	z.object({
		optimize_area: OptimizeHabitationResponsePartSchema,
		optimize_cost: OptimizeHabitationResponsePartSchema,
		difference_area: z.number(),
		difference_cost: z.number(),
		difference_cost_area: z.number(),
	});

export type OptimizeHabitationPayloadType = z.infer<
	typeof OptimizaHabitationPayloadSchema
>;

export type OptimizeHabitationResponseType = z.infer<
	typeof OptimizeHabitationResponseSchema
>;
