import { describe, it, expect, vi } from "vitest";

import { apiService } from "@/lib/apiService";
import { callUserLogin } from "@/features/account/account";
import {
	LoginPayloadSchema,
	LoginResponseSchema,
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
			LoginResponseSchema,
			true
		);

		expect(result).toEqual(mockResponse);
	});
});
