import { AxiosRequestConfig } from "axios";

declare namespace API {
	interface QueueRetryItem<T = unknown> {
		resolve: (value?: T) => void;
		reject: (error?: unknown) => void;
		config: AxiosRequestConfig;
	}
}
