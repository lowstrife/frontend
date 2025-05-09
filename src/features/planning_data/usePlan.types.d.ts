export interface IPlanRouteParams {
	planetNaturalId: string | undefined;
	planUuid: string | undefined;
	sharedPlanUuid: string | undefined;
}

export type LOAD_STATUS =
	| "LOADING"
	| "DONE"
	| "LOAD_FAILURE"
	| "MISSING_PLANET_ID";
