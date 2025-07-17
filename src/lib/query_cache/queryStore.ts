// stores/queryStore.ts
import { defineStore } from "pinia";
import { reactive, computed, ComputedRef } from "vue";
import { QueryDefinition } from "./queryRepository";
import { JSONValue, toCacheKey } from "./cacheKeys";

export interface QueryState<TData> {
	data: TData | null;
	loading: boolean;
	error: Error | null;
	timestamp: number;
	expireTime?: number;
}

export const useQueryStore = defineStore("queryStore", () => {
	// 1) Our shared cache
	const cache = reactive(new Map<JSONValue, QueryState<unknown>>());

	// 2) In-flight promises to dedupe parallel fetches
	const inFlight = new Map<JSONValue, Promise<unknown>>();

	/**
	 * Read-only: peek at an existing state entry (never creates).
	 */
	function peekQueryState<TData>(
		key: JSONValue
	): QueryState<TData> | undefined {
		return isKnownAndFresh(key)
			? (cache.get(toCacheKey(key)) as QueryState<TData>)
			: undefined;
	}

	function isKnownAndFresh(key: JSONValue): ComputedRef<boolean> {
		return computed(() => {
			const keyHash: string = toCacheKey(key);
			const state = cache.get(keyHash);

			// state is undefined => false
			if (!state) return false;

			// state is known
			// if no expireTime, its fresh => true
			if (!state.expireTime) return true;

			// check the expire time

			const now = Date.now();
			const expired = now - state.timestamp > state.expireTime;

			if (expired) {
				console.log("expired", keyHash, state);
				return false;
			} else {
				console.log("fresh", keyHash, state);
				return true;
			}
		});
	}

	/**
	 * Core fetch logic:
	 * - Creates an entry if missing
	 * - Caches results per `persist`
	 * - Honors `expireTime`
	 * - Dedupes parallel calls
	 */
	async function executeQuery<TParams, TData>(
		definition: QueryDefinition<TParams, TData>,
		params?: TParams,
		options?: { forceRefetch?: boolean }
	): Promise<TData> {
		const key = toCacheKey(definition.key(params));
		const shouldCache = definition.persist !== false;

		// initialize cache entry once
		if (!cache.has(key)) {
			cache.set(key, {
				data: null,
				loading: false,
				error: null,
				timestamp: 0,
				expireTime: undefined,
			});
		}
		const state = cache.get(key)! as QueryState<TData>;

		state.expireTime = definition.expireTime;
		const now = Date.now();
		const ttl = definition.expireTime;
		const expired = ttl !== undefined && now - state.timestamp > ttl;

		// return cached if valid
		if (
			shouldCache &&
			!options?.forceRefetch &&
			!expired &&
			state.data !== null
		) {
			return state.data;
		}

		// if a fetch is already running for this key, reuse it
		if (inFlight.has(key) && !options?.forceRefetch) {
			return inFlight.get(key)! as Promise<TData>;
		}

		// mark loading
		state.loading = true;
		state.error = null;

		// start fetch
		const promise = (async () => {
			try {
				const result = await definition.fetchFn(params);

				if (shouldCache) {
					state.data = result;
					state.timestamp = Date.now();
				}

				return result;
			} catch (err) {
				state.error =
					err instanceof Error ? err : new Error(String(err));

				throw state.error;
			} finally {
				state.loading = false;

				inFlight.delete(key);
				if (!shouldCache) {
					cache.delete(key);
				}
			}
		})();

		inFlight.set(key, promise);
		return promise;
	}

	/**
	 * Remove from cache (and cancel in-flight).
	 * Optionally refetch if `autoRefetch` or `options.refetch` is true.
	 */
	async function invalidateQuery<TParams, TData>(
		definition: QueryDefinition<TParams, TData>,
		params?: TParams,
		options?: { refetch?: boolean }
	): Promise<void> {
		const key = toCacheKey(definition.key(params));
		cache.delete(key);
		inFlight.delete(key);

		const shouldRefetch = options?.refetch ?? definition.autoRefetch;
		if (shouldRefetch) {
			await executeQuery(definition, params);
		}
	}

	/** Force cache bypass */
	function refetchQuery<TParams, TData>(
		definition: QueryDefinition<TParams, TData>,
		params: TParams
	): Promise<TData> {
		return executeQuery(definition, params, { forceRefetch: true });
	}

	/** True if any query in cache is loading */
	const isAnythingLoading = computed(() =>
		Array.from(cache.values()).some((s) => s.loading)
	);

	return {
		cache,
		peekQueryState,
		executeQuery,
		invalidateQuery,
		refetchQuery,
		isAnythingLoading,
	};
});
