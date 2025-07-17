import {
	callDataExchanges,
	callDataMaterials,
	callDataPlanet,
} from "@/features/api/gameData.api";
import { JSONValue } from "./cacheKeys";
import { IExchange, IMaterial, IPlanet } from "@/features/api/gameData.types";
import { useGameDataStore } from "@/stores/gameDataStore";
import { callClonePlan } from "@/features/api/planData.api";
import { IPlanCloneResponse } from "@/features/manage/manage.types";
// import { useQueryStore } from "./queryStore";
// const queryStore = useQueryStore();

export interface QueryDefinition<TParams, TData> {
	/** unique key builder */
	key: (params?: TParams) => JSONValue;
	/** actual fetch function */
	fetchFn: (params?: TParams) => Promise<TData>;
	/** if true, invalidating will immediately refetch */
	autoRefetch?: boolean;
	/** how long (ms) before cached data is considered stale/expired */
	expireTime?: number;
	/** if false, this query never caches its results */
	persist?: boolean;
}

const gameDataStore = useGameDataStore();

export const queryRepository = {
	GetMaterials: {
		key: () => ["materials", "list"] as JSONValue,
		fetchFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			const data: IMaterial[] = await callDataMaterials();

			gameDataStore.setMaterials(data);
			return data;
		},
		autoRefetch: true,
		// expireTime: 60_000 * 5, // 5 min,
		expireTime: 5_000, // 5 sec,
		persist: true,
	} as QueryDefinition<void, IMaterial[]>,
	GetExchanges: {
		key: () => ["exchanges", "list"] as JSONValue,
		fetchFn: async () => {
			const data: IExchange[] = await callDataExchanges();

			gameDataStore.setExchanges(data);

			// queryStore.invalidateQuery(
			// 	queryRepository.GetMaterials,
			// 	undefined,
			// 	{ refetch: true }
			// );

			return data;
		},
		autoRefetch: true,
		expireTime: 60_000 * 5, // 5 min,
		persist: true,
	} as QueryDefinition<void, IExchange[]>,
	GetPlanet: {
		key: (data: { planetNaturalId: string }) => [
			"planet",
			data.planetNaturalId,
		],
		fetchFn: async (data: { planetNaturalId: string }) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
			return await callDataPlanet(data.planetNaturalId);
		},
		autoRefetch: true,
		persist: true,
	} as QueryDefinition<{ planetNaturalId: string }, IPlanet>,
	ClonePlan: {
		key: (data: { planUuid: string; cloneName: string }) => [
			"plan",
			"clone",
			data.planUuid,
		],
		fetchFn: async (data: { planUuid: string; cloneName: string }) => {
			await new Promise((resolve) => setTimeout(resolve, 3000));
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
