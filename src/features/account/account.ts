import { apiService } from "@/lib/apiService";
import {
	LoginPayloadSchema,
	LoginPayloadType,
	LoginResponseSchema,
	LoginResponseType,
} from "@/features/account/account.schemas";

/**
 * Calls the backends Login endpoint
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
): Promise<Account.ILoginResponse> {
	return apiService.post<LoginPayloadType, LoginResponseType>(
		"/user/login",
		{
			username,
			password,
		},
		LoginPayloadSchema,
		LoginResponseSchema,
		true
	);
}
