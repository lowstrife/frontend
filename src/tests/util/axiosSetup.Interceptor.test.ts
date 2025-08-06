import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { useUserStore } from "@/stores/userStore";

import axiosSetup from "@/util/axiosSetup";
import { createPinia, setActivePinia } from "pinia";

const fakeAccessToken: string =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDU5MjE5MzEsInN1YiI6InNjb3JwaW8ifQ.upB1_kdh162soNKosnPnG_SnNR8WnDgZMB1mbDqwOtI";
const fakeInitialRefreshToken: string =
	"ayJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDY1MjQ5MzEsInN1YiI6InNjb3JwaW8ifQ.Cw01c-gGUzSnKEhKWErdRUSW4XDWQ5rHbEGt0bgqm8M";
const fakeRefreshToken: string =
	"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3NDY1MjQ5MzEsInN1YiI6InNjb3JwaW8ifQ.Cw01c-gGUzSnKEhKWErdRUSW4XDWQ5rHbEGt0bgqm8M";

describe("Axios Interceptor", () => {
	let mockAxios: MockAdapter;
	let userStore: any;

	beforeEach(() => {
		setActivePinia(createPinia());
		mockAxios = new MockAdapter(axios);

		userStore = useUserStore();
		mockAxios.resetHandlers();
		axiosSetup();
	});

	it("Logout and Redirect on 401 from /user/refresh", async () => {
		mockAxios.onPost("/user/refresh").reply(401);

		const logout = vi.spyOn(userStore, "logout");

		try {
			await axios.post("/user/refresh");
		} catch (error) {
			expect(logout).toHaveBeenCalled();
		}
	});

	it("Refresh Token Sucess and Try again", async () => {
		mockAxios.onGet("/test").replyOnce(401).onGet("/test").reply(200);
		mockAxios.onPost("/user/refresh").reply(200, {
			access_token: fakeAccessToken,
			refresh_token: fakeRefreshToken,
		});
		mockAxios.onGet("/user/profile").reply(200, {});

		userStore.refreshToken = fakeInitialRefreshToken;

		const refresh = vi.spyOn(userStore, "performTokenRefresh");
		const token = vi.spyOn(userStore, "setToken");

		try {
			await axios.get("/test");
		} catch {
			expect(refresh).toHaveBeenCalled();
			expect(token).toHaveBeenCalled();
		}
		expect(userStore.accessToken).toBe(fakeAccessToken);
		expect(userStore.refreshToken).toBe(fakeRefreshToken);
	});

	it("Refresh Token Failure, logout and push to /", async () => {
		mockAxios.onGet("/test").reply(401);
		mockAxios.onPost("/user/refresh").reply(401);

		const logout = vi.spyOn(userStore, "logout");

		try {
			await axios.get("/test");
		} catch {
			expect(logout).toHaveBeenCalled();
		}
	});

	it("500 error should reject", async () => {
		mockAxios.onGet("/test").reply(500);

		await expect(axios.get("/test")).rejects.toThrowError(
			/^Request failed with status code 500$/
		);
	});
});
