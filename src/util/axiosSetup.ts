import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

import { router } from "@/router/router";
import { useUserStore } from "@/stores/userStore";
import { API } from "@/lib/apiService.types";

const setAxiosHeader = (
	config: InternalAxiosRequestConfig<unknown>
): InternalAxiosRequestConfig<unknown> => {
	const userStore = useUserStore();
	const token = userStore.accessToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
		config.headers.withCredentials = true;
	}

	return config;
};

export default function axiosSetup() {
	const userStore = useUserStore();

	// Interceptors

	// Request Authorization Header
	axios.interceptors.request.use(
		async (config) => setAxiosHeader(config),
		(error) => {
			Promise.reject(error);
		}
	);

	// Response Token Refresh
	const refreshRetryQueue: API.QueueRetryItem[] = [];
	let isRefreshing = false;

	axios.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest: AxiosRequestConfig = error.config;

			// error response with 401
			if (
				originalRequest.url &&
				error.response &&
				error.response.status === 401
			) {
				// error already on 401
				if (originalRequest.url.includes("/refresh")) {
					userStore.logout();
					router.push("/");
				}

				if (!isRefreshing) {
					isRefreshing = true;

					// call userStore and token refresh
					const tokenRefreshStatus: boolean =
						await userStore.performTokenRefresh();

					if (tokenRefreshStatus) {
						// got a new access token, retry
						refreshRetryQueue.forEach(({ config, resolve, reject }) => {
							axios(config)
								.then((response) => resolve(response))
								.catch((err) => reject(err));
						});
						refreshRetryQueue.length = 0;
						isRefreshing = false;
					} else {
						// token refresh failed, logout
						userStore.logout();
						router.push("/");
						isRefreshing = false;
						return Promise.reject(error);
					}
				}
				return new Promise<void>((resolve, reject) => {
					refreshRetryQueue.push({ config: originalRequest, resolve, reject });
				});
			}

			return Promise.reject(error);
		}
	);
}
