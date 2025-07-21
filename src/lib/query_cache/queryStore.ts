// stores/queryStore.ts
import { defineStore } from "pinia";
import { reactive, computed, ComputedRef } from "vue";
import { isSubset, toCacheKey } from "./cacheKeys";
import { JSONValue, QueryDefinition, QueryState } from "./queryCache.types";

export const useQueryStore = defineStore("prunplanner_query_store", () => {
	const cache = reactive(new Map<string, QueryState<unknown, unknown>>());
	const inFlight = new Map<string, Promise<unknown>>();

	/**
	 * Peaks a queries state readonly without ever creating it on call.
	 * Will take into account existance as well as "fresh" state, will
	 * return undefined if the state is not existing or stale.
	 *
	 * @author jplacht
	 *
	 * @readonly
	 * @template TParams Query Params Type
	 * @template TData Query Data Type
	 * @param {JSONValue} key Query Key
	 * @returns {(QueryState<TParams, TData> | undefined)} QueryState or Undefined
	 */
	function peekQueryState<TParams, TData>(
		key: JSONValue
	): QueryState<TParams, TData> | undefined {
		return isKnownAndFresh(key)
			? (cache.get(toCacheKey(key)) as QueryState<TParams, TData>)
			: undefined;
	}

	/**
	 * Checks a given query key for existance and if still fresh.
	 * Freshness is given if:
	 * - Key must exist
	 * - Key does not have an expiry time, it is always fresh
	 * - Or key has an expiry time that is still valid now
	 *
	 * @author jplacht
	 *
	 * @param {JSONValue} key Query Key
	 * @returns {ComputedRef<boolean>} Existing and fresh state
	 */
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
				return false;
			} else {
				return true;
			}
		});
	}

	/**
	 * Executes a query with the following core fetch logic:
	 * - Creates the query entry if missing
	 * - Caches results if the definition states persist = true
	 * - Honors the expireTime value on the queryState for staleness
	 * - Dedupes parallel call executions
	 *
	 * @author jplacht
	 *
	 * @async
	 * @template TParams Query Params Type
	 * @template TData Query Data Type
	 * @param {QueryDefinition<TParams, TData>} definition Query Definition
	 * @param {?TParams} [params] Query Params
	 * @param {?{ forceRefetch?: boolean }} [options] Should always load fresh
	 * @returns {Promise<TData>} Query Execution Response
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

				console.error(err);
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
	 * Invalidates given key in the store
	 *
	 * @author jplacht
	 *
	 * @async
	 * @template TParams Query Params Type
	 * @template TData Query Data Type
	 * @param {JSONValue} key Query Key
	 * @param {{ exact?: boolean; forceRefetch?: boolean; skipRefetch?: boolean }} [options={
	 * 			exact: true,
	 * 			forceRefetch: false,
	 * 			skipRefetch: false,
	 * 		}] Options, by default will check for exact matches and doesn't force refresh
	 * @returns {Promise<void>}
	 */
	async function invalidateKey<TParams, TData>(
		key: JSONValue,
		options: {
			exact?: boolean;
			forceRefetch?: boolean;
			skipRefetch?: boolean;
		} = {
			exact: true,
			forceRefetch: false,
			skipRefetch: false,
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

			if (
				!options.skipRefetch &&
				(options.forceRefetch || refetchEntry.definition!.autoRefetch)
			) {
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
	 * True, if any cache state is currently loading
	 * @author jplacht
	 *
	 * @type {ComputedRef<boolean>}
	 */
	const isAnythingLoading: ComputedRef<boolean> = computed(() =>
		Array.from(cache.values()).some((s) => s.loading)
	);

	// Regular status watcher
	let intervalId: ReturnType<typeof setInterval> | null = null;

	/**
	 * Iterates over cache entries and triggers refresh if
	 * marked as to be automatically refetched
	 *
	 * @author jplacht
	 */
	function checkEntryStatusAndRefresh() {
		const now = Date.now();

		for (const [key, entry] of cache.entries()) {
			if (
				entry.expireTime &&
				!entry.loading &&
				entry.error === null &&
				now - entry.timestamp > entry.expireTime
			) {
				if (entry.definition !== null) {
					// trigger refresh
					if (entry.definition.autoRefetch) {
						executeQuery(
							entry.definition,
							entry.params !== null ? entry.params : undefined
						);
					} else {
						// delete as stale and should not refetch
						invalidateKey(JSON.parse(key) as JSONValue);
					}
				}
			}
		}
	}

	/**
	 * Starts the entry status watcher, prevents multiple watchers
	 * to be running in parallel.
	 *
	 * @author jplacht
	 */
	function startStatusWatcher() {
		// prevent multiple invervals running
		if (intervalId !== null) return;

		intervalId = setInterval(() => checkEntryStatusAndRefresh(), 1000);
	}

	// start the status watcher
	startStatusWatcher();

	return {
		cache,
		peekQueryState,
		executeQuery,
		invalidateKey,
		isAnythingLoading,
		// only exposed for testing
		checkEntryStatusAndRefresh,
		startStatusWatcher,
	};
});
