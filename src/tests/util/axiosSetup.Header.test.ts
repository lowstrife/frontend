import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import axios from "axios";

import axiosSetup, { setAxiosHeader } from "@/util/axiosSetup";
import { useUserStore } from "@/stores/userStore";
import { router } from "@/router";
import { createPinia, setActivePinia } from "pinia";

vi.mock("@/stores/userStore", () => ({
	useUserStore: vi.fn(),
}));
vi.mock("@/router/router", () => ({
	router: { push: vi.fn() },
}));

describe("Axios Header", () => {
	it("Set Authorization Header if accessToken is available", () => {
		const mockUserStore = { accessToken: "mock-token" };
		// @ts-expect-error mock
		useUserStore.mockReturnValue(mockUserStore);

		const config = { headers: {} };

		// @ts-expect-error mock
		const result = setAxiosHeader(config);

		expect(result.headers.Authorization).toBe("Bearer mock-token");
		expect(result.headers.withCredentials).toBe(true);
	});

	it("No Authorization Header if accessToken missing", () => {
		const mockUserStore = { accessToken: undefined };

		// @ts-expect-error mock
		useUserStore.mockReturnValue(mockUserStore);

		const config = { headers: {} };

		// @ts-expect-error mock
		const result = setAxiosHeader(config);

		expect(result.headers.Authorization).toBeUndefined();
		expect(result.headers.withCredentials).toBeUndefined();
	});
});

// describe("Axios Response Interceptor", () => {
// 	let capturedResponseInterceptor: any;
// 	let capturedResponseErrorInterceptor: any;
// 	let mockPerformTokenRefresh: any;
// 	let mockLogout: any;

// 	beforeEach(() => {
// 		vi.restoreAllMocks();

// 		mockPerformTokenRefresh = vi.fn();
// 		mockLogout = vi.fn();

// 		(useUserStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
// 			accessToken: "mockAccessToken",
// 			performTokenRefresh: mockPerformTokenRefresh,
// 			logout: mockLogout,
// 		});

// 		vi.spyOn(axios.interceptors.response, "use").mockImplementation(
// 			(fulfilled, rejected) => {
// 				capturedResponseInterceptor = fulfilled;
// 				capturedResponseErrorInterceptor = rejected;
// 				return 0;
// 			}
// 		);

// 		vi.spyOn(axios, "request").mockResolvedValue({ data: "retry success" });

// 		setActivePinia(createPinia());
// 		axiosSetup();
// 	});

// 	it("should refresh token and retry request on 401 error", async () => {
// 		mockPerformTokenRefresh.mockResolvedValue(true);

// 		const fakeError = {
// 			config: { url: "/test", headers: {} },
// 			response: { status: 401 },
// 		};

// 		const retryPromise = capturedResponseErrorInterceptor(fakeError);

// 		expect(typeof retryPromise.then).toBe("function");
// 		expect(mockPerformTokenRefresh).toHaveBeenCalled();
// 	});

// 	it("should logout and redirect if token refresh fails", async () => {
// 		const userStore = useUserStore();
// 		const mockLogout = vi.fn();
// 		userStore.logout = mockLogout;

// 		mockPerformTokenRefresh.mockResolvedValue(false);

// 		const fakeError = {
// 			config: { url: "/test", headers: {} },
// 			response: { status: 401 },
// 		};
// 		const retryPromise = capturedResponseErrorInterceptor(fakeError);

// 		await expect(retryPromise).rejects.toThrow();

// 		expect(mockLogout).toHaveBeenCalled();
// 		expect(router.push).toHaveBeenCalledWith("/");
// 	});

// 	it("should logout immediately if refresh endpoint 401 fails", async () => {
// 		const userStore = useUserStore();
// 		const mockLogout = vi.fn();
// 		userStore.logout = mockLogout;

// 		mockPerformTokenRefresh.mockResolvedValue(false);

// 		const fakeError = {
// 			config: { url: "/refresh", headers: {} },
// 			response: { status: 401 },
// 		};

// 		await capturedResponseErrorInterceptor(fakeError).catch(() => {});

// 		expect(mockLogout).toHaveBeenCalled();
// 		expect(router.push).toHaveBeenCalledWith("/");
// 	});
// });
