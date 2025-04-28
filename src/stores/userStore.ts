import { defineStore } from "pinia";
import { callRefreshToken, callUserLogin } from "@/features/account/account";
import { computed, ComputedRef, ref, Ref } from "vue";

export const useUserStore = defineStore(
	"prunplanner_user",
	() => {
		// state
		const accessToken: Ref<string | undefined> = ref(undefined);
		const refreshToken: Ref<string | undefined> = ref(undefined);

		// getters
		const isLoggedIn: ComputedRef<boolean> = computed(
			() => accessToken.value !== undefined && refreshToken.value !== undefined
		);

		// functions
		function setToken(access: string, refresh: string): void {
			accessToken.value = access;
			refreshToken.value = refresh;
		}

		function logout(): void {
			accessToken.value = undefined;
			refreshToken.value = undefined;
		}

		async function performLogin(
			username: string,
			password: string
		): Promise<boolean> {
			try {
				const tokenData: Account.ITokenResponse = await callUserLogin(
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

		async function performTokenRefresh(): Promise<boolean> {
			if (refreshToken.value) {
				try {
					const tokenData: Account.ITokenResponse = await callRefreshToken(
						refreshToken.value
					);
					setToken(tokenData.access_token, tokenData.refresh_token);
					return true;
				} catch {
					return false;
				}
			} else {
				return false;
			}
		}

		return {
			accessToken,
			refreshToken,
			// getters
			isLoggedIn,
			// functions
			setToken,
			logout,
			performLogin,
			performTokenRefresh,
		};
	},
	{
		persist: {
			pick: ["accessToken", "refreshToken"],
		},
	}
);
