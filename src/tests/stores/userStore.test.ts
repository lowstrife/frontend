import { setActivePinia, createPinia } from "pinia";
import { beforeEach, describe, it, expect, vi } from "vitest";

import { callUserLogin } from "@/features/account/account";
import { useUserStore } from "@/stores/userStore";
import { afterEach } from "node:test";

describe("User Store", () => {
	afterEach(() => {
		vi.resetAllMocks();
	});

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

		vi.mock("@/features/account/account", () => ({
			callUserLogin: vi.fn(),
		}));

		const mockUsername = "testuser";
		const mockPassword = "testpassword";
		const mockTokenData = {
			access_token: "mockAccessToken",
			refresh_token: "mockRefreshToken",
		};

		// @ts-expect-error mock
		callUserLogin.mockResolvedValue(mockTokenData);

		const result = await userStore.performLogin(mockUsername, mockPassword);

		expect(callUserLogin).toHaveBeenCalledWith(mockUsername, mockPassword);

		expect(result).toBe(true);
	});

	it("Perform Login and set token: error response", async () => {
		const userStore = useUserStore();

		vi.mock("@/features/account/account", () => ({
			callUserLogin: vi.fn(),
		}));

		const mockUsername = "testuser";
		const mockPassword = "testpassword";

		(callUserLogin as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("Mock login error")
		);

		const result = await userStore.performLogin(mockUsername, mockPassword);
		expect(callUserLogin).toHaveBeenCalledWith(mockUsername, mockPassword);

		expect(result).toBe(false);
	});
});
