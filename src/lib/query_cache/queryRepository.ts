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
	callGetShared,
} from "@/features/api/planData.api";
import { IPlanCloneResponse } from "@/features/manage/manage.types";
import { useQueryStore } from "./queryStore";
import {
	IPlan,
	IPlanEmpireElement,
	IPlanShare,
} from "@/stores/planningStore.types";
import { callGetEmpireList } from "@/features/api/empireData.api";
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
			console.log("fetch planet", params.planetNaturalId, data);
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
	GetAllEmpires: {
		key: () => ["planningdata", "empires", "list"],
		fetchFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			const data = await callGetEmpireList();

			// set!
			return data;
		},
		autoRefetch: true,
		persist: true,
	} as QueryDefinition<void, IPlanEmpireElement[]>,
	GetPlan: {
		key: (params: { planUuid: string }) => [
			"planningdata",
			"plan",
			params.planUuid,
		],
		fetchFn: async (params: { planUuid: string }) => {
			const data = await callGetPlan(params.planUuid);

			return data;
		},
		autoRefetch: false,
		persist: true,
	} as QueryDefinition<{ planUuid: string }, IPlan>,
	ClonePlan: {
		key: (params: { planUuid: string; cloneName: string }) => [
			"planningdata",
			"plan",
			"clone",
			params.planUuid,
		],
		fetchFn: async (params: { planUuid: string; cloneName: string }) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			queryStore.invalidateKey(["exchanges", "list"]);

			return await callClonePlan(params.planUuid, params.cloneName);
		},
		expireTime: 5_000, // 5 sec,
		autoRefetch: false,
		persist: false,
	} as QueryDefinition<
		{ planUuid: string; cloneName: string },
		IPlanCloneResponse
	>,
};
