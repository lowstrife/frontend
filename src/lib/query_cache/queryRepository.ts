import {
	callDataBuildings,
	callDataExchanges,
	callDataMaterials,
	callDataMultiplePlanets,
	callDataPlanet,
	callDataRecipes,
} from "@/features/api/gameData.api";
import { JSONValue } from "./cacheKeys";
import {
	IBuilding,
	IExchange,
	IMaterial,
	IPlanet,
	IRecipe,
} from "@/features/api/gameData.types";
import { useGameDataStore } from "@/stores/gameDataStore";
import {
	callClonePlan,
	callGetPlan,
	callGetPlanlist,
	callGetShared,
} from "@/features/api/planData.api";
import { IPlanCloneResponse } from "@/features/manage/manage.types";
import { useQueryStore } from "./queryStore";
import {
	ICX,
	IPlan,
	IPlanEmpireElement,
	IPlanShare,
} from "@/stores/planningStore.types";
import {
	callGetEmpireList,
	callGetEmpirePlans,
} from "@/features/api/empireData.api";
import { callGetCXList } from "@/features/api/cxData.api";
import { IShared } from "@/features/api/sharingData.types";
import { callGetSharedList } from "@/features/api/sharingData.api";
const queryStore = useQueryStore();

export interface QueryDefinition<TParams, TData> {
	key: (params?: TParams) => JSONValue;
	fetchFn: (params?: TParams) => Promise<TData>;
	autoRefetch?: boolean;
	expireTime?: number;
	persist?: boolean;
}

const gameDataStore = useGameDataStore();

export const queryRepository = {
	GetMaterials: {
		key: () => ["gamedata", "materials"] as JSONValue,
		fetchFn: async () => {
			const data: IMaterial[] = await callDataMaterials();
			gameDataStore.setMaterials(data);
			return data;
		},
		autoRefetch: true,
		expireTime: 60_000 * 5, // 5 min,
		// expireTime: 5_000, // 5 sec,
		persist: true,
	} as QueryDefinition<void, IMaterial[]>,
	GetExchanges: {
		key: () => ["gamedata", "exchanges"] as JSONValue,
		fetchFn: async () => {
			const data: IExchange[] = await callDataExchanges();
			gameDataStore.setExchanges(data);
			return data;
		},
		autoRefetch: true,
		expireTime: 60_000 * 30, // 30 min,
		persist: true,
	} as QueryDefinition<void, IExchange[]>,
	GetRecipes: {
		key: () => ["gamedata", "recipes"] as JSONValue,
		fetchFn: async () => {
			const data: IRecipe[] = await callDataRecipes();
			gameDataStore.setRecipes(data);
			return data;
		},
		autoRefetch: true,
		expireTime: 60_000 * 30, // 30 min,
		persist: true,
	} as QueryDefinition<void, IRecipe[]>,
	GetBuildings: {
		key: () => ["gamedata", "buildings"] as JSONValue,
		fetchFn: async () => {
			const data: IBuilding[] = await callDataBuildings();
			gameDataStore.setBuildings(data);
			return data;
		},
		autoRefetch: true,
		expireTime: 60_000 * 30, // 30 min,
		persist: true,
	} as QueryDefinition<void, IBuilding[]>,
	GetPlanet: {
		key: (data: { planetNaturalId: string }) => [
			"gamedata",
			"planet",
			data.planetNaturalId,
		],
		fetchFn: async (params: { planetNaturalId: string }) => {
			const data: IPlanet = await callDataPlanet(params.planetNaturalId);
			gameDataStore.setPlanet(data);
			return data;
		},
		expireTime: 60_000 * 60 * 3, // 3 hours,
		autoRefetch: true,
		persist: true,
	} as QueryDefinition<{ planetNaturalId: string }, IPlanet>,
	GetMultiplePlanets: {
		key: (data: { planetNaturalIds: string[] }) => [
			"gamedata",
			"planet",
			"multiple",
			data.planetNaturalIds,
		],
		fetchFn: async (params: { planetNaturalIds: string[] }) => {
			const data: IPlanet[] = await callDataMultiplePlanets(
				params.planetNaturalIds
			);
			gameDataStore.setMultiplePlanets(data);
			return data;
		},
		expireTime: 60_000 * 60 * 3, // 3 hours,
		autoRefetch: true,
		persist: true,
	} as QueryDefinition<{ planetNaturalIds: string[] }, IPlanet[]>,
	GetSharedPlan: {
		key: (params: { sharedPlanUuid: string }) => [
			"planningdata",
			"shared",
			params.sharedPlanUuid,
		],
		fetchFn: async (params: { sharedPlanUuid: string }) => {
			return await callGetShared(params.sharedPlanUuid);
		},
		persist: true,
		autoRefetch: false,
		expireTime: 10_000,
	} as QueryDefinition<{ sharedPlanUuid: string }, IPlanShare>,
	GetAllShared: {
		key: () => ["planningdata", "shared", "list"],
		fetchFn: async () => {
			return await callGetSharedList();
		},
		persist: true,
		autoRefetch: true,
		expireTime: 60_000 * 60,
	} as QueryDefinition<void, IShared[]>,
	GetAllEmpires: {
		key: () => ["planningdata", "empire", "list"],
		fetchFn: async () => {
			const data = await callGetEmpireList();

			// # TODO set!
			return data;
		},
		autoRefetch: false,
		persist: true,
	} as QueryDefinition<void, IPlanEmpireElement[]>,
	GetEmpirePlans: {
		key: (params: { empireUuid: string }) => [
			"planningdata",
			"empire",
			"plans",
			params.empireUuid,
		],
		fetchFn: async (params: { empireUuid: string }) => {
			const data = await callGetEmpirePlans(params.empireUuid);
			// # TODO set!
			return data;
		},
		autoRefetch: false,
		persist: true,
	} as QueryDefinition<{ empireUuid: string }, IPlan[]>,
	GetAllCX: {
		key: () => ["planningdata", "cx"],
		fetchFn: async () => {
			const data = await callGetCXList();
			// # TODO set!
			return data;
		},
		autoRefetch: false,
		persist: true,
	} as QueryDefinition<void, ICX[]>,
	GetPlan: {
		key: (params: { planUuid: string }) => [
			"planningdata",
			"plan",
			params.planUuid,
		],
		fetchFn: async (params: { planUuid: string }) => {
			const data = await callGetPlan(params.planUuid);
			// # TODO set!
			return data;
		},
		autoRefetch: false,
		persist: true,
	} as QueryDefinition<{ planUuid: string }, IPlan>,
	GetAllPlans: {
		key: () => ["planningdata", "plan", "list"],
		fetchFn: async () => {
			const data = await callGetPlanlist();
			// # TODO set!
			return data;
		},
		autoRefetch: false,
		persist: true,
	} as QueryDefinition<void, IPlan[]>,
	ClonePlan: {
		key: (params: { planUuid: string; cloneName: string }) => [
			"planningdata",
			"plan",
			"clone",
			params.planUuid,
		],
		fetchFn: async (params: { planUuid: string; cloneName: string }) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			queryStore.invalidateKey(["planningdata", "empires"]);

			return await callClonePlan(params.planUuid, params.cloneName);
		},
		autoRefetch: false,
		persist: false,
	} as QueryDefinition<
		{ planUuid: string; cloneName: string },
		IPlanCloneResponse
	>,
};
