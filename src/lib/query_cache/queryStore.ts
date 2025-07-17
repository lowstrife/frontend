// stores/queryStore.ts
import { defineStore } from "pinia";
import { reactive, computed, ComputedRef } from "vue";
import { QueryDefinition } from "./queryRepository";
import { isSubset, JSONValue, toCacheKey } from "./cacheKeys";

export interface QueryState<TParams, TData> {
	// definition
	definition: QueryDefinition<TParams, TData> | null;
	params: TParams | null;
	// state
	data: TData | null;
	loading: boolean;
	error: Error | null;
	timestamp: number;
	expireTime?: number;
}

export const useQueryStore = defineStore("queryStore", () => {
	const cache = reactive(new Map<string, QueryState<unknown, unknown>>());
	const inFlight = new Map<string, Promise<unknown>>();

	/**
	 * Read-only: peek at an existing state entry (never creates).
	 */
	function peekQueryState<TParams, TData>(
		key: JSONValue
	): QueryState<TParams, TData> | undefined {
		return isKnownAndFresh(key)
			? (cache.get(toCacheKey(key)) as QueryState<TParams, TData>)
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
		const keyHash: string = toCacheKey(definition.key(params));
		const shouldCache: boolean = definition.persist !== false;

		// initialize cache entry once
		if (!cache.has(keyHash)) {
			cache.set(keyHash, {
				definition: null,
				params: null,
				data: null,
				loading: false,
				error: null,
				timestamp: 0,
				expireTime: undefined,
			});
		}
		const state = cache.get(keyHash)! as QueryState<TParams, TData>;

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
		if (inFlight.has(keyHash) && !options?.forceRefetch) {
			return inFlight.get(keyHash)! as Promise<TData>;
		}

		// set definition and params
		state.definition = definition;
		if (params) state.params = params;

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

				inFlight.delete(keyHash);
				if (!shouldCache) {
					cache.delete(keyHash);
				}
			}
		})();

		inFlight.set(keyHash, promise);
		return promise;
	}

	/**
	 * Remove from cache (and cancel in-flight).
	 * Optionally refetch if `autoRefetch` or `options.refetch` is true.
	 */
	async function invalidateKey<TParams, TData>(
		key: JSONValue,
		options: { exact?: boolean; forceRefetch?: boolean } = {
			exact: true,
			forceRefetch: false,
		}
	): Promise<void> {
		const keyHash: string = toCacheKey(key);

		const toRefetch: {
			definition: QueryDefinition<TParams, TData> | null;
			params: TParams | null;
		}[] = [];

		if (options.exact) {
			if (cache.has(keyHash)) {
				const existingEntry = cache.get(keyHash)!;
				toRefetch.push({
					definition: existingEntry.definition as QueryDefinition<
						TParams,
						TData
					> | null,
					params: existingEntry.params as TParams | null,
				});
			}

			// delete exact matched key and inflight
			cache.delete(keyHash);
			inFlight.delete(keyHash);
		} else {
			for (const existingKey of cache.keys()) {
				// Note: as keys are strings, need to parse them to JSONValue
				if (isSubset(key, JSON.parse(existingKey) as JSONValue)) {
					// add subset query
					const existingEntry = cache.get(existingKey)!;
					toRefetch.push({
						definition: existingEntry.definition as QueryDefinition<
							TParams,
							TData
						> | null,
						params: existingEntry.params as TParams | null,
					});

					// delete non-exact matched key and inflight
					cache.delete(existingKey);
					inFlight.delete(keyHash);
				}
			}
		}

		// check and trigger refetches if defined or forced
		toRefetch.map(async (refetchEntry) => {
			// refetch without definition not possible
			if (refetchEntry.definition && refetchEntry.definition == null)
				return;

			// refetch can be forced from invalidate options or set
			// in the query definition itself

			if (options.forceRefetch || refetchEntry.definition!.autoRefetch) {
				// if params are null, no params required, pass undefined
				await executeQuery(
					refetchEntry.definition!,
					refetchEntry.params !== null
						? refetchEntry.params
						: undefined
				);
			}
		});
	}

	/**
	 * Remove from cache (and cancel in-flight).
	 * Optionally refetch if `autoRefetch` or `options.refetch` is true.
	 */
	async function invalidateQuery<TParams, TData>(
		definition: QueryDefinition<TParams, TData>,
		params?: TParams,
		options: { exact?: boolean; refetch?: boolean } = {
			exact: true,
			refetch: false,
		}
	): Promise<void> {
		const keyHash: string = toCacheKey(definition.key(params));

		if (options.exact) {
			cache.delete(keyHash);
			inFlight.delete(keyHash);
		} else {
			for (const key of cache.keys()) {
				if (
					isSubset(
						definition.key(params),
						JSON.parse(key) as JSONValue
					)
				) {
					cache.delete(key);
				}
			}
		}

		const shouldRefetch = options.refetch ?? definition.autoRefetch;
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

	// Regular status watcher
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function checkEntryStatusAndRefresh() {
		const now = Date.now();

		for (const entry of cache.values()) {
			if (
				entry.expireTime &&
				!entry.loading &&
				entry.error === null &&
				now - entry.timestamp > entry.expireTime
			) {
				// trigger refresh
				if (entry.definition !== null && entry.definition.autoRefetch) {
					executeQuery(
						entry.definition,
						entry.params !== null ? entry.params : undefined
					);
				}
			}
		}
	}

	function statusWatcher() {
		// prevent multiple invervals running
		if (intervalId !== null) return;

		intervalId = setInterval(() => checkEntryStatusAndRefresh(), 1000);
	}

	// start the status watcher
	statusWatcher();

	return {
		cache,
		peekQueryState,
		executeQuery,
		invalidateQuery,
		invalidateKey,
		refetchQuery,
		isAnythingLoading,
	};
});
