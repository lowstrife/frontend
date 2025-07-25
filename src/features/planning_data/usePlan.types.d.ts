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

export interface IPlanPatchMaterialIOElement {
	uuid: string;
	planet_id: string;
	material_io: {
		ticker: string;
		input: number;
		output: number;
	}[];
}
