import posthog, { Properties } from "posthog-js";

// Util
import { redact } from "@/util/data";

export function usePostHog() {
	const posthogToken: string | undefined = import.meta.env.VITE_POSTHOG_TOKEN;
	const posthogName: string | undefined = import.meta.env.VITE_POSTHOG_NAME;

	const SENSITIVE_KEYS: string[] = [
		"password",
		"access_token",
		"refresh_token",
	];

	if (posthogToken) {
		posthog.init(posthogToken, {
			api_host: "https://squirrel.prunplanner.org/relay-DWJJ",
			ui_host: "https://eu.posthog.com",
			defaults: "2025-05-24",
			person_profiles: "identified_only",
			name: posthogName ?? "localhost",
		});
	}

	function capture<T extends Properties | null | undefined>(
		eventName: string,
		props: T
	) {
		if (posthog.__loaded) {
			// redact props
			if (props) props = redact(props, SENSITIVE_KEYS);

			posthog.capture(eventName, props);
		}
	}

	return { posthog, capture };
}
