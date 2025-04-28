import { apiService } from "@/lib/apiService";
import {
	LoginPayloadSchema,
	LoginPayloadType,
	TokenResponseSchema,
	TokenResponseType,
	RefreshPayloadType,
	RefreshPayloadSchema,
} from "@/features/account/account.schemas";

/**
 * Calls the backends Login endpoint to return Token
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} username Username Plain
 * @param {string} password Password Plain
 * @returns {Promise<Account.ILoginResponse>} Token Response
 */
export async function callUserLogin(
	username: string,
	password: string
): Promise<Account.ITokenResponse> {
	return apiService.post<LoginPayloadType, TokenResponseType>(
		"/user/login",
		{
			username,
			password,
		},
		LoginPayloadSchema,
		TokenResponseSchema,
		true
	);
}

export async function callRefreshToken(
	refresh_token: string
): Promise<Account.ITokenResponse> {
	return apiService.post<RefreshPayloadType, TokenResponseType>(
		"/user/refresh",
		{
			refresh_token,
		},
		RefreshPayloadSchema,
		TokenResponseSchema,
		true
	);
}
