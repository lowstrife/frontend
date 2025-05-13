import {
	IPlanDataBuilding,
	IPlanDataInfrastructure,
	IPlanDataPlanet,
	PLAN_FACTION,
} from "@/stores/planningStore.types";

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

export interface IPlanCreateData {
	name: string;
	planet_id: string;
	faction: PLAN_FACTION;
	override_empire: boolean;
	permits_used: number;
	permits_total: number;
	planet: IPlanDataPlanet;
	infrastructure: IPlanDataInfrastructure[];
	buildings: IPlanDataBuilding[];
	empire_uuid?: string;
}

export interface IPlanSaveData extends IPlanCreateData {
	uuid: string;
}

export interface IPlanSaveCreateResponse {
	uuid: string;
}
