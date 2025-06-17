import { computed, WritableComputedRef } from "vue";

// Stores
import { useUserStore } from "@/stores/userStore";

export function usePreferences() {
	const userStore = useUserStore();

	const defaultEmpireUuid: WritableComputedRef<
		string | undefined,
		string | undefined
	> = computed<string | undefined>({
		get: () => userStore.preferences.defaultEmpireUuid,
		set: (v) => userStore.setPreference("defaultEmpireUuid", v),
	});

	const burnDaysRed: WritableComputedRef<number, number> = computed<number>({
		get: () => userStore.preferences.burnDaysRed,
		set: (v) => userStore.setPreference("burnDaysRed", v),
	});

	const burnDaysYellow: WritableComputedRef<number, number> =
		computed<number>({
			get: () => userStore.preferences.burnDaysYellow,
			set: (v) => userStore.setPreference("burnDaysYellow", v),
		});

	const planSettings = computed(() => {
		return userStore.preferences.planOverrides;
	});

	return {
		defaultEmpireUuid,
		burnDaysRed,
		burnDaysYellow,
		planSettings,
	};
}
