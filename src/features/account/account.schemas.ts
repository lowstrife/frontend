import { z } from "zod";

export const LoginPayloadSchema: z.ZodType<Account.ILoginPayload> = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

export const LoginResponseSchema: z.ZodType<Account.ILoginResponse> = z.object({
	access_token: z.string().min(127),
	refresh_token: z.string().min(127),
});

export type LoginPayloadType = z.infer<typeof LoginPayloadSchema>;
export type LoginResponseType = z.infer<typeof LoginResponseSchema>;
