import { z } from "zod";
import {
	IExploration,
	IExplorationRequestPayload,
} from "@/features/market_exploration/marketExploration.types";

const ExplorationSchema: z.ZodType<IExploration> = z.object({
	Datetime: z.string().date(),
	ExchangeCode: z.string().min(3).max(3),
	Ticker: z.string().min(1).max(3),
	price_first: z.number(),
	price_last: z.number(),
	price_average: z.number(),
	price_min: z.number(),
	price_max: z.number(),
	volume_max: z.number(),
	demand_average: z.number(),
	supply_average: z.number(),
	delta_supply_demand: z.number(),
});

export const ExplorationPayloadSchema: z.ZodType<IExploration[]> =
	z.array(ExplorationSchema);

export const ExplorationRequestPayloadSchema: z.ZodType<IExplorationRequestPayload> =
	z.object({
		start: z.string().date(),
		end: z.string().date(),
	});

export type ExplorationPayloadType = z.infer<typeof ExplorationPayloadSchema>;
export type ExplorationRequestPayloadType = z.infer<
	typeof ExplorationRequestPayloadSchema
>;
