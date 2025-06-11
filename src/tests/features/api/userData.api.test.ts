import { describe, it, expect, vi } from "vitest";

import { apiService } from "@/lib/apiService";
import {
	callGetProfile,
	callRefreshToken,
	callUserLogin,
} from "@/features/api/userData.api";
import {
	LoginPayloadSchema,
	RefreshPayloadSchema,
	TokenResponseSchema,
	UserProfilePayloadSchema,
} from "@/features/api/schemas/user.schemas";

vi.mock("@/lib/apiService", () => ({
	apiService: {
		post: vi.fn(),
		get: vi.fn(),
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

	it("callGetProfile: Calls API Service and gets correct response", async () => {
		const mockResponse = {
			user_id: 1,
			username: "foo",
			email: "",
			email_verified: true,
			fio_apikey: "foo@moo.de",
			prun_username: "foo",
			last_login: new Date(),
			last_action: new Date(),
		};

		// @ts-expect-error - mock post typing
		apiService.get.mockResolvedValue(mockResponse);

		const result = await callGetProfile();

		expect(apiService.get).toHaveBeenCalledWith(
			"/user/profile",
			UserProfilePayloadSchema
		);

		expect(result).toEqual(mockResponse);
	});
});
