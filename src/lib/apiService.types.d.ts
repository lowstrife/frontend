import { AxiosRequestConfig } from "axios";

declare namespace API {
	interface QueueRetryItem {
		resolve: (value?: any) => void;
		reject: (error?: any) => void;
		config: AxiosRequestConfig;
	}
}
