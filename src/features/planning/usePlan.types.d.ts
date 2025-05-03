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

export type PLAN_COGCPROGRAM_TYPE =
	| "---"
	| "AGRICULTURE"
	| "CHEMISTRY"
	| "CONSTRUCTION"
	| "ELECTRONICS"
	| "FOOD_INDUSTRIES"
	| "FUEL_REFINING"
	| "MANUFACTURING"
	| "METALLURGY"
	| "RESOURCE_EXTRACTION"
	| "PIONEERS"
	| "SETTLERS"
	| "TECHNICIANS"
	| "ENGINEERS"
	| "SCIENTISTS";

export type PLAN_FACTION =
	| "NONE"
	| "ANTARES"
	| "BENTEN"
	| "HORTUS"
	| "MORIA"
	| "OUTSIDEREGION";

export interface IPlanDataPlanet {
	planetid: string;
	permits: number;
	corphq: boolean;
	cogc: PLAN_COGCPROGRAM_TYPE;
	experts: IPlanDataExpert[];
	workforce: IPlanDataWorkforce[];
}

export interface IPlanDataInfrastructure {
	building:
		| "HB1"
		| "HB2"
		| "HB3"
		| "HB4"
		| "HB5"
		| "HBB"
		| "HBC"
		| "HBM"
		| "HBL"
		| "STO";
	amount: number;
}

export interface IPlanDataExpert {
	type:
		| "Agriculture"
		| "Chemistry"
		| "Construction"
		| "Electronics"
		| "Food_Industries"
		| "Fuel_Refining"
		| "Manufacturing"
		| "Metallurgy"
		| "Resource_Extraction";
	amount: number;
}

export interface IPlanDataWorkforce {
	type: "pioneer" | "settler" | "technician" | "engineer" | "scientist";
	lux1: boolean;
	lux2: boolean;
}

export interface IPlanDataBuildingRecipe {
	recipeid: string;
	amount: number;
}

export interface IPlanDataBuilding {
	name: string;
	amount: number;
	active_recipes: IPlanDataBuildingRecipe[];
}

export interface IPlanData {
	planet: IPlanDataPlanet;
	infrastructure: IPlanDataInfrastructure[];
	buildings: IPlanDataBuilding[];
}

export interface IPlanEmpire {
	faction: string;
	permits_used: number;
	permits_total: number;
	uuid: string;
	name: string;
	use_fio_storage: boolean;
}

export interface IPlan {
	name: string | undefined;
	uuid: string | undefined;
	planet_id: string;
	faction: PLAN_FACTION;
	permits_used: number;
	permits_total: number;
	override_empire: boolean;
	baseplanner_data: IPlanData;
	empires: IPlanEmpire[];
}

export interface IPlanShare {
	uuid: string;
	created_date: string;
	view_count: number;
	baseplanner: IPlan;
}
