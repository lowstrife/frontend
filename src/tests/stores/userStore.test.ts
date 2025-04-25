import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, it, expect } from "vitest";

import { useUserStore } from "@/stores/userStore";

describe("User Store", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("Initial store tokens and status", () => {
		const userStore = useUserStore();

		expect(userStore.accessToken).toBeUndefined();
		expect(userStore.refreshToken).toBeUndefined();
		expect(userStore.isLoggedIn).toBeFalsy();
	});

	it("Tokens set, logged in", () => {
		const userStore = useUserStore();

		userStore.setTokens("foo", "moo");

		expect(userStore.isLoggedIn).toBeTruthy();
	});
	it("Logout", () => {
		const userStore = useUserStore();

		userStore.logout();

		expect(userStore.accessToken).toBeUndefined();
		expect(userStore.refreshToken).toBeUndefined();
		expect(userStore.isLoggedIn).toBeFalsy();
	});
});
