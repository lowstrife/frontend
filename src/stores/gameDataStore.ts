import { defineStore } from "pinia";
import { computed, ComputedRef, ref, Ref } from "vue";

import config from "@/lib/config";
import { getDifferenceMinutes } from "@/util/date";

import {
	callDataBuildings,
	callDataExchanges,
	callDataMaterials,
	callDataPlanet,
	callDataRecipes,
} from "@/features/game_data/gameData";
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
		const lastRefreshedPlanets: Ref<IPlanetsLastRefreshedRecord> = ref({});

		// getters
		const hasMaterials: ComputedRef<boolean> = computed(
			() => Object.keys(materials.value).length > 0
		);
		const hasExchanges: ComputedRef<boolean> = computed(
			() => Object.keys(exchanges.value).length > 0
		);
		const hasRecipes: ComputedRef<boolean> = computed(
			() => Object.keys(recipes.value).length > 0
		);
		const hasBuildings: ComputedRef<boolean> = computed(
			() => Object.keys(buildings.value).length > 0
		);

		function hasPlanet(planetNaturalId: string): boolean {
			return Object.keys(planets.value).includes(planetNaturalId);
		}

		// functions

		/// Data Loader
		async function performLoadMaterials(): Promise<boolean> {
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

				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}

		async function performLoadExchanges(): Promise<boolean> {
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

				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}

		async function performLoadRecipes(): Promise<boolean> {
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

				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}

		async function performLoadBuildings(): Promise<boolean> {
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
				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}

		async function performLoadPlanet(
			planetNaturalId: string
		): Promise<boolean> {
			try {
				const planetData: IPlanet = await callDataPlanet(planetNaturalId);

				// store data
				planets.value[planetData.PlanetNaturalId] = planetData;

				// set last refreshed
				lastRefreshedPlanets.value[planetData.PlanetNaturalId] = new Date();

				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}

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
					loadFunction: performLoadRecipes,
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
			// getters
			hasMaterials,
			hasExchanges,
			hasRecipes,
			hasBuildings,
			hasPlanet,
			// functions
			performLoadMaterials,
			performLoadExchanges,
			performLoadRecipes,
			performLoadBuildings,
			performLoadPlanet,
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
