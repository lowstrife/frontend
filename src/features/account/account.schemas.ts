import { z } from "zod";

export const LoginPayloadSchema: z.ZodType<Account.ILoginPayload> = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

export const TokenResponseSchema: z.ZodType<Account.ITokenResponse> = z.object({
	access_token: z.string().min(120),
	refresh_token: z.string().min(120),
});

export const RefreshPayloadSchema: z.ZodType<Account.IRefreshPayload> =
	z.object({
		refresh_token: z.string().min(120),
	});

export type LoginPayloadType = z.infer<typeof LoginPayloadSchema>;
export type TokenResponseType = z.infer<typeof TokenResponseSchema>;
export type RefreshPayloadType = z.infer<typeof RefreshPayloadSchema>;
