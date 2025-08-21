import { QueryDefinition } from "@/lib/query_cache/queryCache.types";
import {
	IBuilding,
	IExchange,
	IFIOSites,
	IFIOStorage,
	IMaterial,
	IPlanet,
	IPlanetSearchAdvanced,
	IPopulationReport,
	IRecipe,
} from "@/features/api/gameData.types";

import {
	ICXEmpireJunction,
	IPlanCloneResponse,
	IPlanEmpireJunction,
} from "@/features/manage/manage.types";
import {
	ICX,
	ICXData,
	IPlan,
	IPlanEmpire,
	IPlanEmpireElement,
	IPlanShare,
} from "@/stores/planningStore.types";

import {
	IShared,
	ISharedCreateResponse,
} from "@/features/api/sharingData.types";

import {
	IExploration,
	IExplorationRequestPayload,
} from "@/features/market_exploration/marketExploration.types";
import {
	IEmpireCreatePayload,
	IEmpirePatchPayload,
} from "@/features/empire/empire.types";
import {
	IPlanCreateData,
	IPlanPatchMaterialIOElement,
	IPlanSaveData,
} from "@/features/planning_data/usePlan.types";
import { PlanSaveCreateResponseType } from "@/features/api/schemas/planningData.schemas";
import {
	IOptimizeHabitationPayload,
	IOptimizeHabitationResponse,
} from "@/features/api/schemas/optimize.schemas";
import { IUserProfile, IUserProfilePatch } from "@/features/api/userData.types";

export type QueryRepositoryType = {
	GetMaterials: QueryDefinition<void, IMaterial[]>;
	GetExchanges: QueryDefinition<void, IExchange[]>;
	GetRecipes: QueryDefinition<void, IRecipe[]>;
	GetBuildings: QueryDefinition<void, IBuilding[]>;
	GetPlanet: QueryDefinition<{ planetNaturalId: string }, IPlanet>;
	GetMultiplePlanets: QueryDefinition<
		{ planetNaturalIds: string[] },
		IPlanet[]
	>;
	GetPlanetSearchSingle: QueryDefinition<{ searchId: string }, IPlanet[]>;
	PostPlanetSearch: QueryDefinition<
		{ searchData: IPlanetSearchAdvanced },
		IPlanet[]
	>;
	GetSharedPlan: QueryDefinition<{ sharedPlanUuid: string }, IPlanShare>;
	GetAllShared: QueryDefinition<void, IShared[]>;
	DeleteSharedPlan: QueryDefinition<{ sharedUuid: string }, boolean>;
	CreateSharedPlan: QueryDefinition<
		{ planUuid: string },
		ISharedCreateResponse
	>;
	CreateEmpire: QueryDefinition<{ data: IEmpireCreatePayload }, IPlanEmpire>;
	DeleteEmpire: QueryDefinition<{ empireUuid: string }, boolean>;
	PatchEmpireCXJunctions: QueryDefinition<
		{ junctions: ICXEmpireJunction[] },
		ICX[]
	>;
	PatchCX: QueryDefinition<{ cxUuid: string; data: ICXData }, ICXData>;
	GetAllEmpires: QueryDefinition<void, IPlanEmpireElement[]>;
	GetEmpirePlans: QueryDefinition<{ empireUuid: string }, IPlan[]>;
	PatchEmpire: QueryDefinition<
		{ empireUuid: string; data: IEmpirePatchPayload },
		IPlanEmpire
	>;
	PatchEmpirePlanJunctions: QueryDefinition<
		{ junctions: IPlanEmpireJunction[] },
		IPlanEmpireElement[]
	>;
	CreateCX: QueryDefinition<{ cxName: string }, ICX>;
	DeleteCX: QueryDefinition<{ cxUuid: string }, boolean>;
	GetAllCX: QueryDefinition<void, ICX[]>;
	GetPlan: QueryDefinition<{ planUuid: string }, IPlan>;
	GetAllPlans: QueryDefinition<void, IPlan[]>;
	ClonePlan: QueryDefinition<
		{ planUuid: string; cloneName: string },
		IPlanCloneResponse
	>;
	DeletePlan: QueryDefinition<{ planUuid: string }, boolean>;
	CreatePlan: QueryDefinition<
		{ data: IPlanCreateData },
		PlanSaveCreateResponseType
	>;
	PatchPlan: QueryDefinition<
		{ planUuid: string; data: IPlanSaveData },
		PlanSaveCreateResponseType
	>;
	PatchMaterialIO: QueryDefinition<
		{ data: IPlanPatchMaterialIOElement[] },
		boolean
	>;
	GetExplorationData: QueryDefinition<
		{
			exchangeTicker: string;
			materialTicker: string;
			payload: IExplorationRequestPayload;
		},
		IExploration[]
	>;
	GetFIOStorage: QueryDefinition<void, IFIOStorage>;
	GetFIOSites: QueryDefinition<void, IFIOSites>;
	GetPlanetLastPOPR: QueryDefinition<
		{ planetNaturalId: string },
		IPopulationReport
	>;
	OptimizeHabitation: QueryDefinition<
		IOptimizeHabitationPayload,
		IOptimizeHabitationResponse
	>;
	PatchUserProfile: QueryDefinition<IUserProfilePatch, IUserProfile>;
};
