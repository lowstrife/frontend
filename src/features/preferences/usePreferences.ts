import { computed, ComputedRef, WritableComputedRef } from "vue";

// Stores
import { useUserStore } from "@/stores/userStore";
import { usePlanningStore } from "@/stores/planningStore";

// Composables
import { usePlan } from "@/features/planning_data/usePlan";

// Default values
import { preferenceDefaults } from "@/features/preferences/userDefaults";

// Types & Interfaces
import {
	IPlanPreferenceOverview,
	IPreferencePerPlan,
} from "@/features/preferences/userPreferences.types";

export function usePreferences() {
	const userStore = useUserStore();
	const planningStore = usePlanningStore();

	const { getPlanNamePlanet } = usePlan();

	/**
	 * Writable computed for the users default Empire UUID
	 *
	 * @author jplacht
	 *
	 * @type {WritableComputedRef<
	 * 		string | undefined,
	 * 		string | undefined
	 * 	>}
	 */
	const defaultEmpireUuid: WritableComputedRef<
		string | undefined,
		string | undefined
	> = computed<string | undefined>({
		get: () => userStore.preferences.defaultEmpireUuid,
		set: (v) => userStore.setPreference("defaultEmpireUuid", v),
	});

	/**
	 * Writable computed for the users RED alert on burn views
	 *
	 * @author jplacht
	 *
	 * @type {WritableComputedRef<number, number>}
	 */
	const burnDaysRed: WritableComputedRef<number, number> = computed<number>({
		get: () => userStore.preferences.burnDaysRed,
		set: (v) => userStore.setPreference("burnDaysRed", v),
	});

	/**
	 * Writable computed for the users YELLOW alert on burn views
	 *
	 * @author jplacht
	 *
	 * @type {WritableComputedRef<number, number>}
	 */
	const burnDaysYellow: WritableComputedRef<number, number> =
		computed<number>({
			get: () => userStore.preferences.burnDaysYellow,
			set: (v) => userStore.setPreference("burnDaysYellow", v),
		});

	/**
	 * Computed getter for users overrides on invididual plan preferences
	 *
	 * @author jplacht
	 *
	 * @type {ComputedRef<
	 * 		Record<string, Partial<IPreferencePerPlan>>
	 * 	>}
	 */
	const planSettings: ComputedRef<
		Record<string, Partial<IPreferencePerPlan>>
	> = computed(() => {
		return userStore.preferences.planOverrides;
	});

	/**
	 * Computed overview array of users plan specific settings, checks settings
	 * for existance and against default values
	 *
	 * @author jplacht
	 *
	 * @type {ComputedRef<IPlanPreferenceOverview[]>}
	 */
	const planSettingsOverview: ComputedRef<IPlanPreferenceOverview[]> =
		computed(() => {
			const overview: IPlanPreferenceOverview[] = [];

			for (const [planUuid, preference] of Object.entries(
				planSettings.value
			) as [string, Partial<IPreferencePerPlan>][]) {
				// fetch generic plan information
				try {
					const { planetId, planName } = getPlanNamePlanet(planUuid);

					const planOverview = {
						planUuid: planUuid,
						planetId: planetId,
						planName: planName,
						preferences: [] as string[],
					};

					// handle individual preferences
					if (
						"includeCM" in preference &&
						preference.includeCM !==
							preferenceDefaults.planDefaults.includeCM
					) {
						planOverview.preferences.push("Include CM");
					}

					if (
						"visitationMaterialExclusions" in preference &&
						preference.visitationMaterialExclusions &&
						preference.visitationMaterialExclusions.length > 0
					) {
						planOverview.preferences.push(
							"Visitation Material Exclusions"
						);
					}

					// add to overview if there is a pref set
					if (planOverview.preferences.length > 0) {
						overview.push(planOverview);
					}
				} catch {
					continue;
				}
			}

			return overview;
		});

	/**
	 * Gets all existing Plan UUIDs from the planning store that must have
	 * been fetched previously, also looks for plan-specific settings defined
	 * by the user and cleans up those settings where the plan does not exist
	 * anymore and has been deleted. Should only be called if a full plan
	 * load has been executed before within the planning store.
	 *
	 * @author jplacht
	 */
	function cleanPlanPreferences(): void {
		const existingPlanUuids: string[] = Object.keys(planningStore.plans);
		const existingPlanPreferenceUuids: string[] = Object.keys(
			planSettings.value
		);

		const notExistAnymore = existingPlanPreferenceUuids.filter(
			(id) => !new Set(existingPlanUuids).has(id)
		);

		// clear all plans settings that don't exist anymore
		if (notExistAnymore.length > 0) {
			notExistAnymore.forEach((planUuid) => {
				userStore.clearPlanPreference(planUuid);
			});
		}
	}

	/**
	 * Generates CSS classes to visualize a value in relation to the users
	 * preferred minimum burn days to display the "red" or "yellow" category
	 *
	 * @author jplacht
	 *
	 * @param {number} value Value of days actual
	 * @returns {ComputedRef<string>} Burn Type CSS class
	 */
	function getBurnDisplayClass(value: number): ComputedRef<string> {
		return computed(() => {
			if (value <= burnDaysRed.value) {
				return "text-white bg-negative";
			} else if (value <= burnDaysYellow.value)
				return "text-black bg-positive";
			else return "";
		});
	}

	return {
		// preferences
		defaultEmpireUuid,
		burnDaysRed,
		burnDaysYellow,
		planSettings,
		planSettingsOverview,
		// functions
		cleanPlanPreferences,
		getBurnDisplayClass,
	};
}
