import { computed, ComputedRef } from "vue";

// Stores
import { useUserStore } from "@/stores/userStore";

// Types & Interfaces
import { IPreferencePerPlan } from "@/features/preferences/userPreferences.types";

export function usePlanPreferences(planUuid: string) {
	const userStore = useUserStore();

	const fullPreferences: ComputedRef<IPreferencePerPlan> = computed(() =>
		userStore.getPlanPreference(planUuid)
	);

	function setPlanPreference<K extends keyof typeof fullPreferences.value>(
		key: K,
		value: (typeof fullPreferences.value)[K]
	): void {
		userStore.setPlanPreference(planUuid, { [key]: value });
	}

	function clearPlanPreference(): void {
		userStore.clearPlanPreference(planUuid);
	}

	const includeCM: ComputedRef<boolean> = computed(
		() => fullPreferences.value.includeCM
	);

	function setIncludeCM(value: boolean): void {
		setPlanPreference("includeCM", value);
	}

	return {
		fullPreferences,
		setPlanPreference,
		clearPlanPreference,
		// getter
		includeCM,
		// setter
		setIncludeCM,
	};
}
