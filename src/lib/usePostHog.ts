import posthog from "posthog-js";

export function usePostHog() {
	const posthogToken: string | undefined = import.meta.env.VITE_POSTHOG_TOKEN;
	const posthogName: string | undefined = import.meta.env.VITE_POSTHOG_NAME;

	if (posthogToken) {
		posthog.init(posthogToken, {
			api_host: "https://squirrel.prunplanner.org",
			ui_host: "https://eu.posthog.com",
			defaults: "2025-05-24",
			person_profiles: "identified_only",
			name: posthogName ?? "localhost",
		});
	}

	return { posthog };
}
