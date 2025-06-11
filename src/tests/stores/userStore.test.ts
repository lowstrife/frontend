import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { callUserLogin, callRefreshToken } from "@/features/api/userData.api";
import { useUserStore } from "@/stores/userStore";

describe("User Store", () => {
	beforeEach(() => {
		setActivePinia(createPinia());

		vi.mock("@/features/api/userData.api", () => ({
			callUserLogin: vi.fn(),
			callRefreshToken: vi.fn(),
		}));
	});

	it("Initial store tokens and status", () => {
		const userStore = useUserStore();

		expect(userStore.accessToken).toBeUndefined();
		expect(userStore.refreshToken).toBeUndefined();
		expect(userStore.isLoggedIn).toBeFalsy();
	});

	it("Tokens set, logged in", () => {
		const userStore = useUserStore();

		userStore.setToken("foo", "moo");

		expect(userStore.isLoggedIn).toBeTruthy();
	});

	it("Logout", () => {
		const userStore = useUserStore();

		userStore.logout();

		expect(userStore.accessToken).toBeUndefined();
		expect(userStore.refreshToken).toBeUndefined();
		expect(userStore.isLoggedIn).toBeFalsy();
	});

	it("Perform Login and set token: ok", async () => {
		const userStore = useUserStore();

		const mockUsername = "testuser";
		const mockPassword = "testpassword";
		const mockTokenData = {
			access_token: "mockAccessToken",
			refresh_token: "mockRefreshToken",
		};
		(
			callUserLogin as unknown as ReturnType<typeof vi.fn>
		).mockResolvedValue(mockTokenData);

		const result = await userStore.performLogin(mockUsername, mockPassword);

		expect(callUserLogin).toHaveBeenCalledWith(mockUsername, mockPassword);

		expect(result).toBe(true);
	});

	it("Perform Login and set token: error response", async () => {
		const userStore = useUserStore();

		const mockUsername = "testuser";
		const mockPassword = "testpassword";

		(
			callUserLogin as unknown as ReturnType<typeof vi.fn>
		).mockRejectedValue(new Error("Mock login error"));

		const result = await userStore.performLogin(mockUsername, mockPassword);
		expect(callUserLogin).toHaveBeenCalledWith(mockUsername, mockPassword);

		expect(result).toBe(false);
	});

	it("Perform Token Refresh", async () => {
		const userStore = useUserStore();

		const mockToken = "testtoken";
		const mockTokenData = {
			access_token: "mockAccessToken",
			refresh_token: "mockRefreshToken",
		};

		userStore.refreshToken = mockToken;

		(
			callRefreshToken as unknown as ReturnType<typeof vi.fn>
		).mockReturnValueOnce(mockTokenData);

		expect(userStore.refreshToken).toBe(mockToken);
		const result = await userStore.performTokenRefresh();
		expect(callRefreshToken).toHaveBeenCalledWith(mockToken);

		expect(result).toBe(true);
		expect(userStore.accessToken).toBe(mockTokenData.access_token);
		expect(userStore.refreshToken).toBe(mockTokenData.refresh_token);
	});

	it("Perform Token Refresh, no refresh token", async () => {
		const userStore = useUserStore();

		userStore.refreshToken = undefined;

		const result = await userStore.performTokenRefresh();
		expect(result).toBe(false);
	});

	it("Perform Token Refresh: API Error", async () => {
		const userStore = useUserStore();

		const mockToken = "testtoken";

		userStore.refreshToken = mockToken;

		(
			callRefreshToken as unknown as ReturnType<typeof vi.fn>
		).mockRejectedValue(new Error("Mock login error"));

		const result = await userStore.performTokenRefresh();
		expect(callRefreshToken).toHaveBeenCalledWith(mockToken);

		expect(result).toBe(false);
	});
});
