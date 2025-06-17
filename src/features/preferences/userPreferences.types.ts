export interface IPreferencePerPlan {
	includeCM: boolean;
	visitationMaterialExclusions: string[];
}

export interface IPreference {
	defaultEmpireUuid: string | undefined;
	burnDaysRed: number;
	burnDaysYellow: number;

	// seeding per plan defaults
	planOverrides: Record<string, Partial<IPreferencePerPlan>>;
}

export interface IPreferenceDefault extends IPreference {
	planDefaults: IPreferencePerPlan;
}

export interface IPlanPreferenceOverview {
	planUuid: string;
	planetId: string;
	planName: string;
	preferences: string[];
}
