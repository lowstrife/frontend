import { defineStore } from "pinia";
import { callUserLogin } from "@/features/account/account";

export const useUserStore = defineStore("prunplanner_user", {
	state: () => ({
		accessToken: undefined as string | undefined,
		refreshToken: undefined as string | undefined,
	}),
	persist: {
		pick: ["refreshToken"],
	},
	getters: {
		isLoggedIn: (state) => {
			return (
				state.accessToken !== undefined && state.refreshToken !== undefined
			);
		},
	},
	actions: {
		setTokens(access: string, refresh: string): void {
			this.accessToken = access;
			this.refreshToken = refresh;
		},
		logout(): void {
			this.accessToken = undefined;
			this.refreshToken = undefined;
		},
		async performLogin(username: string, password: string): Promise<boolean> {
			try {
				const tokenData: Account.ILoginResponse = await callUserLogin(
					username,
					password
				);
				this.setTokens(tokenData.access_token, tokenData.refresh_token);
				return true;
			} catch {
				return false;
			}
		},
		async performTokenRefresh(): Promise<boolean> {
			console.info("try refreshing token");
			return false;
		},
	},
});
