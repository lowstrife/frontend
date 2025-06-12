import { defineStore } from "pinia";
import { computed, ComputedRef, ref, Ref } from "vue";

// API
import {
	callGetProfile,
	callRefreshToken,
	callUserLogin,
} from "@/features/api/userData.api";

// Types & Interfaces
import {
	IUserProfile,
	IUserTokenResponse,
} from "@/features/api/userData.types";

export const useUserStore = defineStore(
	"prunplanner_user",
	() => {
		// state
		const accessToken: Ref<string | undefined> = ref(undefined);
		const refreshToken: Ref<string | undefined> = ref(undefined);
		const profile: Ref<IUserProfile | undefined> = ref(undefined);

		// getters
		const isLoggedIn: ComputedRef<boolean> = computed(
			() =>
				accessToken.value !== undefined &&
				refreshToken.value !== undefined
		);

		const hasFIO: ComputedRef<boolean> = computed(
			() =>
				profile.value !== undefined &&
				profile.value.fio_apikey !== "" &&
				profile.value.fio_apikey !== null &&
				profile.value.prun_username !== "" &&
				profile.value.prun_username !== null
		);

		// functions

		/**
		 * Sets access and refresh token
		 * @author jplacht
		 *
		 * @param {string} access Access Token
		 * @param {string} refresh Refresh Token
		 */
		function setToken(access: string, refresh: string): void {
			accessToken.value = access;
			refreshToken.value = refresh;

			// trigger profile refresh non-blocking
			performGetProfile();
		}

		/**
		 * Logs user out by clearing data
		 * @author jplacht
		 */
		function logout(): void {
			accessToken.value = undefined;
			refreshToken.value = undefined;
			profile.value = undefined;
		}

		/**
		 * Performs a login
		 * @author jplacht
		 *
		 * @async
		 * @param {string} username
		 * @param {string} password
		 * @returns {Promise<boolean>}
		 */
		async function performLogin(
			username: string,
			password: string
		): Promise<boolean> {
			try {
				const tokenData: IUserTokenResponse = await callUserLogin(
					username,
					password
				);

				setToken(tokenData.access_token, tokenData.refresh_token);
				return true;
			} catch (err) {
				console.error(err);
				return false;
			}
		}

		/**
		 * Performs a token refresh
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<boolean>}
		 */
		async function performTokenRefresh(): Promise<boolean> {
			if (refreshToken.value) {
				try {
					const tokenData: IUserTokenResponse =
						await callRefreshToken(refreshToken.value);

					setToken(tokenData.access_token, tokenData.refresh_token);
					return true;
				} catch (error) {
					console.error(error);
					return false;
				}
			} else {
				return false;
			}
		}

		/**
		 * Loads the users profile
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<void>} None
		 */
		async function performGetProfile(): Promise<void> {
			// only perform if the user is logged in
			if (isLoggedIn.value) {
				try {
					await callGetProfile().then((result: IUserProfile) => {
						profile.value = result;
					});
				} catch {}
			}
		}

		return {
			accessToken,
			refreshToken,
			profile,
			// getters
			isLoggedIn,
			hasFIO,
			// functions
			setToken,
			logout,
			performLogin,
			performTokenRefresh,
			performGetProfile,
		};
	},
	{
		persist: {
			pick: ["accessToken", "refreshToken", "profile"],
		},
	}
);
