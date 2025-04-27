import { defineStore } from "pinia";
import { callUserLogin } from "@/features/account/account";
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
				const tokenData: Account.ILoginResponse = await callUserLogin(
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
			console.error("TO BE IMPLEMENTED");
			return false;
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
			pick: ["refreshToken"],
		},
	}
);
