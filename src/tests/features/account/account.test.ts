import { describe, it, expect, vi } from "vitest";

import { apiService } from "@/lib/apiService";
import { callRefreshToken, callUserLogin } from "@/features/account/account";
import {
	LoginPayloadSchema,
	RefreshPayloadSchema,
	TokenResponseSchema,
} from "@/features/account/account.schemas";

vi.mock("@/lib/apiService", () => ({
	apiService: {
		post: vi.fn(),
	},
}));

describe("Feature: Account", () => {
	it("callUserLogin: Calls API Service and gets correct response", async () => {
		const mockUsername = "testuser";
		const mockPassword = "testpassword";
		const mockResponse = {
			access_token: "mockAccessToken",
			refresh_token: "mockRefreshToken",
		};

		// @ts-expect-error - mock post typing
		apiService.post.mockResolvedValue(mockResponse);

		const result = await callUserLogin(mockUsername, mockPassword);

		expect(apiService.post).toHaveBeenCalledWith(
			"/user/login",
			{ username: mockUsername, password: mockPassword },
			LoginPayloadSchema,
			TokenResponseSchema,
			true
		);

		expect(result).toEqual(mockResponse);
	});

	it("callRefreshToken: Calls API Service and gets correct response", async () => {
		const mockRefreshToken = "123";
		const mockResponse = {
			access_token: "mockAccessToken",
			refresh_token: "mockRefreshToken",
		};

		// @ts-expect-error - mock post typing
		apiService.post.mockResolvedValue(mockResponse);

		const result = await callRefreshToken(mockRefreshToken);

		expect(apiService.post).toHaveBeenCalledWith(
			"/user/refresh",
			{ refresh_token: mockRefreshToken },
			RefreshPayloadSchema,
			TokenResponseSchema,
			true
		);

		expect(result).toEqual(mockResponse);
	});
});
