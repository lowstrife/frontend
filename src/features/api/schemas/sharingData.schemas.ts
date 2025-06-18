import { z } from "zod";

// Types & Interfaces
import {
	IShared,
	ISharedCreateResponse,
} from "@/features/api/sharingData.types";

// Util
import { PositiveOrZeroNumber } from "@/util/zodValidators";

export const SharedSchema: z.ZodType<IShared> = z.object({
	shared_uuid: z.string().uuid(),
	plan_uuid: z.string().uuid(),
	view_count: PositiveOrZeroNumber,
});

export const SharedListResponseSchema = z.array(SharedSchema);
export type ScharedListResponseType = z.infer<typeof SharedListResponseSchema>;

export const SharedCreateResponseSchema: z.ZodType<ISharedCreateResponse> =
	z.object({
		uuid: z.string().uuid(),
		created_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
			message: "Invalid date string",
		}),
		view_count: PositiveOrZeroNumber,
	});

export type SharedCreateResponseType = z.infer<
	typeof SharedCreateResponseSchema
>;
