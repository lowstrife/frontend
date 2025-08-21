import { apiService } from "@/lib/apiService";

// Schemas
import { z } from "zod";
import {
	LoginPayloadSchema,
	LoginPayloadType,
	TokenResponseSchema,
	TokenResponseType,
	RefreshPayloadType,
	RefreshPayloadSchema,
	UserProfilePayloadType,
	UserProfilePayloadSchema,
	UserProfilePatchPayloadType,
	UserProfilePatchSchema,
} from "@/features/api/schemas/user.schemas";

// Types & Interfaces
import {
	IUserProfile,
	IUserProfilePatch,
	IUserTokenResponse,
} from "@/features/api/userData.types";

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
): Promise<IUserTokenResponse> {
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

/**
 * Calls the backends Token refresh endpoint to fetch new
 * access and refresh tokens
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} refresh_token Current Refresh Token
 * @returns {Promise<IUserTokenResponse>} Token Response
 */
export async function callRefreshToken(
	refresh_token: string
): Promise<IUserTokenResponse> {
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

/**
 * Calls the backends Profile endpoint to fetch users profile
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<IUserProfile>} User Profile
 */
export async function callGetProfile(): Promise<IUserProfile> {
	return apiService.get<UserProfilePayloadType>(
		"/user/profile",
		UserProfilePayloadSchema
	);
}

/**
 * Calls the backend Profile endpoint to patch user profile data
 *
 * @author jplacht
 *
 * @export
 * @async
 * @param {IUserProfilePatch} patchProfile Patched profile
 * @returns {Promise<IUserProfile>} Updated user profile
 */
export async function callPatchProfile(
	patchProfile: IUserProfilePatch
): Promise<IUserProfile> {
	return apiService.patch<
		UserProfilePatchPayloadType,
		UserProfilePayloadType
	>(
		"/user/profile",
		patchProfile,
		UserProfilePatchSchema,
		UserProfilePayloadSchema
	);
}

/**
 * Calls the backend to trigger another send of the email
 * verification email containing the verification code
 *
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<boolean>} Request Status
 */
export async function callResendEmailVerification(): Promise<boolean> {
	return apiService.post<null, boolean>(
		"/user/resend_email_verification",
		null,
		z.null(),
		z.boolean()
	);
}
