import posthog from "posthog-js";

export function usePostHog() {
	const posthogToken: string | undefined = import.meta.env.VITE_POSTHOG_TOKEN;
	const posthogName: string | undefined = import.meta.env.VITE_POSTHOG_NAME;

	if (posthogToken) {
		posthog.init(posthogToken, {
			api_host: "https://squirrel.prunplanner.org/relay-DWJJ",
			ui_host: "https://eu.posthog.com",
			defaults: "2025-05-24",
			person_profiles: "identified_only",
			name: posthogName ?? "localhost",
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function capture(eventName: string, props: any = {}) {
		if (posthog.__loaded) {
			// mark props
			if (props.payload) {
				if (props.payload.refresh_token)
					props.payload.refresh_token = "***";
				if (props.payload.access_token)
					props.payload.access_token = "***";
			}

			posthog.capture(eventName, props);
		}
	}

	return { posthog, capture };
}
