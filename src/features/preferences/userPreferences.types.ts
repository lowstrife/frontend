export interface IPreferencePerPlan {
	includeCM: boolean;
}

export interface IPreference {
	defaultEmpireUuid: string | undefined;
	burnDaysRed: number;
	burnDaysYellow: number;

	// seeding per plan defaults
	planOverrides: Record<string, Partial<IPreferencePerPlan>>;
}

export interface IPreferenceDefault extends IPreference {
	planDefaults: {
		includeCM: boolean;
	};
}
