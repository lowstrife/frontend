import { defineStore } from "pinia";
import { computed, ComputedRef, ref, Ref } from "vue";

// stores
import { useUserStore } from "@/stores/userStore";

// Util
import config from "@/lib/config";
import { getDifferenceMinutes } from "@/util/date";
import { inertClone } from "@/util/data";

import {
	callDataBuildings,
	callDataExchanges,
	callDataMaterials,
	callDataMultiplePlanets,
	callDataPlanet,
	callDataRecipes,
} from "@/features/game_data/gameData.api";
import {
	IBuildingsRecord,
	IExchangesRecord,
	IMaterialsRecord,
	IPlanetsLastRefreshedRecord,
	IPlanetsRecord,
	IRecipesRecord,
	IRefreshDataCheck,
	TOptionalDate,
} from "@/stores/gameDataStore.types";
import {
	IMaterial,
	IExchange,
	IRecipe,
	IBuilding,
	IPlanet,
} from "@/features/game_data/gameData.types";

export const useGameDataStore = defineStore(
	"prunplanner_game_data",
	() => {
		// other stores
		const userStore = useUserStore();

		// state

		/** Key: Material.Ticker */
		const materials: Ref<IMaterialsRecord> = ref({});
		/** Key: Exchange.TickerId */
		const exchanges: Ref<IExchangesRecord> = ref({});
		/** Key: Recipe.BuildingTicker */
		const recipes: Ref<IRecipesRecord> = ref({});
		/** Key: Building.Ticker */
		const buildings: Ref<IBuildingsRecord> = ref({});
		/** Key: Planet.PlanetNaturalId */
		const planets: Ref<IPlanetsRecord> = ref({});

		const lastRefreshedMaterials: Ref<TOptionalDate> = ref(undefined);
		const lastRefreshedExchanges: Ref<TOptionalDate> = ref(undefined);
		const lastRefreshedRecipes: Ref<TOptionalDate> = ref(undefined);
		const lastRefreshedBuildings: Ref<TOptionalDate> = ref(undefined);
		/** Key: Planet.PlanetNaturalId */
		const lastRefreshedPlanets: Ref<IPlanetsLastRefreshedRecord> = ref({});

		let promiseRefreshingMaterials: Promise<boolean> | null = null;
		let promiseRefreshingExchanges: Promise<boolean> | null = null;
		let promiseRefreshingRecipes: Promise<boolean> | null = null;
		let promiseRefreshingBuildings: Promise<boolean> | null = null;
		let promiseRefreshingPlanets: Ref<Record<string, Promise<boolean> | null>> =
			ref({});

		let isRefreshingMaterials: Ref<boolean> = ref(false);
		let isRefreshingExchanges: Ref<boolean> = ref(false);
		let isRefreshingRecipes: Ref<boolean> = ref(false);
		let isRefreshingBuildings: Ref<boolean> = ref(false);
		let isRefreshingPlanets: Ref<Record<string, boolean>> = ref({});

		// computed getters

		/**
		 * Store holds material data
		 * @author jplacht
		 *
		 * @type {ComputedRef<boolean>}
		 */
		const hasMaterials: ComputedRef<boolean> = computed(
			() => Object.keys(materials.value).length > 0
		);

		/**
		 * Store holds exchange data
		 * @author jplacht
		 *
		 * @type {ComputedRef<boolean>}
		 */
		const hasExchanges: ComputedRef<boolean> = computed(
			() => Object.keys(exchanges.value).length > 0
		);

		/**
		 * Store holds recipe data
		 * @author jplacht
		 *
		 * @type {ComputedRef<boolean>}
		 */
		const hasRecipes: ComputedRef<boolean> = computed(
			() => Object.keys(recipes.value).length > 0
		);

		/**
		 * Store holds planet data
		 * @author jplacht
		 *
		 * @type {ComputedRef<boolean>}
		 */
		const hasBuildings: ComputedRef<boolean> = computed(
			() => Object.keys(buildings.value).length > 0
		);

		async function getPlanet(
			planetNaturalId: string,
			force: boolean = false
		): Promise<IPlanet> {
			// if force = false, only fetch new if data is not already available
			if (!force) {
				const findPlanet: IPlanet | undefined = planets.value[planetNaturalId];

				if (findPlanet) return inertClone(findPlanet);

				// nothing found, fetch first, then return
				const fetchedPlanet: boolean = await performLoadPlanet(planetNaturalId);

				if (fetchedPlanet) {
					return inertClone(planets.value[planetNaturalId]);
				} else {
					throw new Error(
						`Unable to fetch Planet with Natural Id '${planetNaturalId}'`
					);
				}
			} else {
				// we're forced to fetch first, then return
				const fetchedPlanet: boolean = await performLoadPlanet(planetNaturalId);

				if (fetchedPlanet) {
					return inertClone(planets.value[planetNaturalId]);
				} else {
					throw new Error(
						`Unable to fetch Planet with Natural Id '${planetNaturalId}'`
					);
				}
			}
		}

		// data loader functions

		/**
		 * Checks for existance of specific planets data
		 * @author jplacht
		 *
		 * @param {string} planetNaturalId Planet Natural Id (e.g. 'OT-580b')
		 * @returns {boolean}
		 */
		function hasPlanet(planetNaturalId: string): boolean {
			return Object.keys(planets.value).includes(planetNaturalId);
		}

		/**
		 * Checks for existance of multiple planets data
		 * @author jplacht
		 *
		 * @param {string[]} planetNaturalIds List of Planet Natural Ids (e.g. ['OT-580b', 'ZV-759b'])
		 * @returns {boolean}
		 */
		function hasMultiplePlanets(planetNaturalIds: string[]): boolean {
			return planetNaturalIds.every((v) =>
				Object.keys(planets.value).includes(v)
			);
		}

		/// Data Loader

		/**
		 * Triggers materials dataload from backend API and stores by Ticker
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<boolean>} Sucess indicator
		 */
		async function performLoadMaterials(): Promise<boolean> {
			if (isRefreshingMaterials.value) {
				return promiseRefreshingMaterials!;
			}

			isRefreshingMaterials.value = true;
			promiseRefreshingMaterials = new Promise<boolean>(async (resolve) => {
				try {
					const materialData: IMaterial[] = await callDataMaterials();

					// initially reset
					materials.value = {};

					// store material data as record
					materialData.forEach((m) => {
						materials.value[m.Ticker] = m;
					});

					// set last refreshed
					lastRefreshedMaterials.value = new Date();

					resolve(true);
				} catch (error) {
					console.error(error);
					resolve(false);
				} finally {
					isRefreshingMaterials.value = false;
					promiseRefreshingMaterials = null;
				}
			});

			return promiseRefreshingMaterials;
		}

		/**
		 * Triggers exchange dataload from backend API and stores by TickerId
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<boolean>} Success indicator
		 */
		async function performLoadExchanges(): Promise<boolean> {
			if (isRefreshingExchanges.value) {
				return promiseRefreshingExchanges!;
			}

			isRefreshingExchanges.value = true;
			promiseRefreshingExchanges = new Promise<boolean>(async (resolve) => {
				try {
					const exchangeData: IExchange[] = await callDataExchanges();

					// initially reset
					exchanges.value = {};

					// store data as record
					exchangeData.forEach((e) => {
						exchanges.value[e.TickerId] = e;
					});

					// set last refreshed
					lastRefreshedExchanges.value = new Date();
					resolve(true);
				} catch (error) {
					console.error(error);
					resolve(false);
				} finally {
					isRefreshingExchanges.value = false;
					promiseRefreshingExchanges = null;
				}
			});

			return promiseRefreshingExchanges;
		}

		/**
		 * Triggers recipe dataload from backend API and stores recipes as list
		 * by recipes Building.BuildingTicker
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<boolean>}
		 */
		async function performLoadRecipes(): Promise<boolean> {
			if (isRefreshingRecipes.value) {
				return promiseRefreshingRecipes!;
			}

			isRefreshingRecipes.value = true;
			promiseRefreshingRecipes = new Promise<boolean>(async (resolve) => {
				try {
					const recipeData: IRecipe[] = await callDataRecipes();

					// initially reset
					recipes.value = {};

					// store data as record
					recipeData.forEach((r) => {
						if (Object.keys(recipes.value).includes(r.BuildingTicker)) {
							recipes.value[r.BuildingTicker].push(r);
						} else {
							recipes.value[r.BuildingTicker] = [r];
						}
					});

					// set last refreshed
					lastRefreshedRecipes.value = new Date();
					resolve(true);
				} catch (error) {
					console.error(error);
					resolve(false);
				} finally {
					isRefreshingRecipes.value = false;
					promiseRefreshingRecipes = null;
				}
			});

			return promiseRefreshingRecipes;
		}

		/**
		 * Triggers building dataload from backend API and stores by Ticker
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<boolean>} Success indicator
		 */
		async function performLoadBuildings(): Promise<boolean> {
			if (isRefreshingBuildings.value) {
				return promiseRefreshingBuildings!;
			}

			isRefreshingBuildings.value = true;
			promiseRefreshingBuildings = new Promise<boolean>(async (resolve) => {
				try {
					const buildingData: IBuilding[] = await callDataBuildings();

					// initially rest
					buildings.value = {};

					// store data as record
					buildingData.forEach((b) => {
						buildings.value[b.Ticker] = b;
					});

					// set last refreshed
					lastRefreshedBuildings.value = new Date();
					resolve(true);
				} catch (error) {
					console.error(error);
					resolve(false);
				} finally {
					isRefreshingBuildings.value = false;
					promiseRefreshingBuildings = null;
				}
			});

			return promiseRefreshingBuildings;
		}

		/**
		 * Triggers single planets dataload from backend API by Planets Natural Id
		 * @author jplacht
		 *
		 * @async
		 * @param {string} planetNaturalId Planet Natural Id (e.g. 'OT-580b')
		 * @returns {Promise<boolean>} Success indicator
		 */
		async function performLoadPlanet(
			planetNaturalId: string
		): Promise<boolean> {
			// find out if the planet is currently refreshing
			const isPlanetRefreshing: boolean | undefined =
				isRefreshingPlanets.value[planetNaturalId];

			if (isPlanetRefreshing && isPlanetRefreshing === true) {
				return promiseRefreshingPlanets.value[planetNaturalId]!;
			}

			// trigger a new refresh as there is none running at the moment
			isRefreshingPlanets.value[planetNaturalId] = true;

			promiseRefreshingPlanets.value[planetNaturalId] = new Promise<boolean>(
				async (resolve) => {
					try {
						const planetData: IPlanet = await callDataPlanet(planetNaturalId);

						// overwrite data
						planets.value[planetNaturalId] = planetData;

						// set last refreshed
						lastRefreshedPlanets.value[planetNaturalId] = new Date();

						resolve(true);
					} catch (error) {
						console.error(error);
						resolve(false);
					} finally {
						isRefreshingPlanets.value[planetNaturalId] = false;
						promiseRefreshingPlanets.value[planetNaturalId] = null;
					}
				}
			);

			return promiseRefreshingPlanets.value[planetNaturalId];
		}

		/**
		 * Triggers multiple planets dataload from backend API by
		 * list of Planet Natural Ids and stores by Planets Natural Id
		 *
		 * @todo Change to not require authenticated user once Backend API changes
		 * @author jplacht
		 *
		 * @async
		 * @param {string[]} planetNaturalIds List of Planet Natural Ids (e.g. ['OT-580b', 'ZV-759b'])
		 * @returns {Promise<boolean>} Success indicator
		 */
		async function performLoadMultiplePlanets(
			planetNaturalIds: string[]
		): Promise<boolean> {
			/*
				NOTE: The API endpoint to fetch multiple planets at once is currently
				restricted to logged-in users. 
			*/
			if (!userStore.isLoggedIn) {
				throw new Error(
					"API endpoint '/data/planet/multiple' can't be called without being logged in."
				);
			}

			try {
				const planetsData: IPlanet[] =
					await callDataMultiplePlanets(planetNaturalIds);

				// validate all was received
				const fetchedIds: string[] = planetsData.map((p) => p.PlanetNaturalId);
				const checkIds = planetNaturalIds.every((v) => fetchedIds.includes(v));

				if (!checkIds) {
					const missing: string[] = planetNaturalIds.filter(
						(item) => fetchedIds.indexOf(item) < 0
					);
					throw new Error(
						`Error fetching all planets. Missing planets: ${missing}`
					);
				}

				// store data and set last refreshed of planet
				planetsData.forEach((planet) => {
					planets.value[planet.PlanetNaturalId] = planet;
					lastRefreshedPlanets.value[planet.PlanetNaturalId] = new Date();
				});

				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}

		/**
		 * Analyses all game data for staleness against configured values and their
		 * last refreshed data, will trigger async data refresh if required
		 * @author jplacht
		 *
		 * @note Do not call sync, as many calls could block the component rendering
		 *
		 * @async
		 * @returns {Promise<void>} Void
		 */
		async function performStaleDataRefresh(): Promise<void> {
			const now: Date = new Date();

			// full data loads
			const refreshData: IRefreshDataCheck[] = [
				{
					time: lastRefreshedBuildings.value,
					staleMinutes: config.GAME_DATA_STALE_MINUTES_BUILDINGS,
					loadFunction: performLoadBuildings,
				},
				{
					time: lastRefreshedRecipes.value,
					staleMinutes: config.GAME_DATA_STALE_MINUTES_RECIPES,
					loadFunction: performLoadRecipes,
				},
				{
					time: lastRefreshedMaterials.value,
					staleMinutes: config.GAME_DATA_STALE_MINUTES_MATERIALS,
					loadFunction: performLoadMaterials,
				},
				{
					time: lastRefreshedExchanges.value,
					staleMinutes: config.GAME_DATA_STALE_MINUTES_EXCHANGES,
					loadFunction: performLoadExchanges,
				},
			];

			refreshData.forEach(({ time, staleMinutes, loadFunction }) => {
				if (getDifferenceMinutes(now, time) > staleMinutes) {
					loadFunction();
				}
			});

			// planetary loads
			Object.keys(lastRefreshedPlanets.value).forEach(
				(planetNaturalId: string) => {
					if (
						getDifferenceMinutes(
							now,
							lastRefreshedPlanets.value[planetNaturalId]
						) > config.GAME_DATA_STALE_MINUTES_PLANETS
					) {
						performLoadPlanet(planetNaturalId);
					}
				}
			);
		}

		return {
			// state
			materials,
			exchanges,
			recipes,
			buildings,
			planets,
			lastRefreshedMaterials,
			lastRefreshedExchanges,
			lastRefreshedRecipes,
			lastRefreshedBuildings,
			lastRefreshedPlanets,
			isRefreshingMaterials,
			isRefreshingExchanges,
			isRefreshingRecipes,
			isRefreshingBuildings,
			isRefreshingPlanets,
			// getters
			hasMaterials,
			hasExchanges,
			hasRecipes,
			hasBuildings,
			hasPlanet,
			hasMultiplePlanets,
			// functions
			getPlanet,
			// functions data loader
			performLoadMaterials,
			performLoadExchanges,
			performLoadRecipes,
			performLoadBuildings,
			performLoadPlanet,
			performLoadMultiplePlanets,
			performStaleDataRefresh,
		};
	},
	{
		persist: {
			pick: [
				"materials",
				"exchanges",
				"recipes",
				"buildings",
				"planets",
				"lastRefreshedMaterials",
				"lastRefreshedExchanges",
				"lastRefreshedRecipes",
				"lastRefreshedBuildings",
				"lastRefreshedPlanets",
			],

			/**
			 * Transforms types from string storage to proper formats
			 * @author jplacht
			 *
			 * @param {PiniaPluginContext} context
			 */
			afterHydrate(context) {
				const store = context.store;

				store.lastRefreshedMaterials
					? (store.lastRefreshedMaterials = new Date(
							store.lastRefreshedMaterials
						))
					: undefined;
				store.lastRefreshedExchanges
					? (store.lastRefreshedExchanges = new Date(
							store.lastRefreshedExchanges
						))
					: undefined;
				store.lastRefreshedRecipes
					? (store.lastRefreshedRecipes = new Date(store.lastRefreshedRecipes))
					: undefined;
				store.lastRefreshedBuildings
					? (store.lastRefreshedBuildings = new Date(
							store.lastRefreshedBuildings
						))
					: undefined;

				if (store.lastRefreshedPlanets) {
					Object.keys(store.lastRefreshedPlanets).forEach(
						(planetNaturalId: string) => {
							store.lastRefreshedPlanets[planetNaturalId] = new Date(
								store.lastRefreshedPlanets[planetNaturalId]
							);
						}
					);
				}
			},
		},
	}
);
