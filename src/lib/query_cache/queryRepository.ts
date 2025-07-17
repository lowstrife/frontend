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
import { callClonePlan } from "@/features/api/planData.api";
import { IPlanCloneResponse } from "@/features/manage/manage.types";
import { useQueryStore } from "./queryStore";
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
	ClonePlan: {
		key: (data: { planUuid: string; cloneName: string }) => [
			"plan",
			"clone",
			data.planUuid,
		],
		fetchFn: async (data: { planUuid: string; cloneName: string }) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));

			queryStore.invalidateKey(["exchanges", "list"]);

			return await callClonePlan(data.planUuid, data.cloneName);
		},
		expireTime: 5_000, // 5 sec,
		autoRefetch: false,
		persist: false,
	} as QueryDefinition<
		{ planUuid: string; cloneName: string },
		IPlanCloneResponse
	>,
};
