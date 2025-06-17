import { IPreferenceDefault } from "@/features/preferences/userPreferences.types";

export const preferenceDefaults: IPreferenceDefault = {
	defaultEmpireUuid: undefined,
	burnDaysRed: 5,
	burnDaysYellow: 10,

	planOverrides: {},
	planDefaults: {
		includeCM: false,
	},
};
