import { defineStore } from "pinia";
import { computed, ComputedRef, ref, Ref } from "vue";

// Util
import { inertClone } from "@/util/data";

// API
import {
	callDataFIOSites,
	callDataFIOStorage,
} from "@/features/api/gameData.api";

// Types & Interfaces
import {
	IBuildingsRecord,
	IExchangesRecord,
	IMaterialsRecord,
	IPlanetsRecord,
	IRecipesRecord,
	TOptionalDate,
} from "@/stores/gameDataStore.types";
import {
	IMaterial,
	IExchange,
	IRecipe,
	IBuilding,
	IPlanet,
	IFIOStorage,
	IFIOStorageShip,
	IFIOStorageWarehouse,
	IFIOStoragePlanet,
	IFIOSites,
	IFIOSitePlanet,
	IFIOSiteShip,
} from "@/features/api/gameData.types";

export const useGameDataStore = defineStore(
	"prunplanner_game_data",
	() => {
		// other stores

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

		const fio_storage_planets: Ref<Record<string, IFIOStoragePlanet>> = ref(
			{}
		);
		const fio_storage_warehouses: Ref<
			Record<string, IFIOStorageWarehouse>
		> = ref({});
		const fio_storage_ships: Ref<Record<string, IFIOStorageShip>> = ref({});
		const fio_sites_planets: Ref<Record<string, IFIOSitePlanet>> = ref({});
		const fio_sites_ships: Ref<Record<string, IFIOSiteShip>> = ref({});

		const lastRefreshedFIOStorage: Ref<TOptionalDate> = ref(undefined);
		const lastRefreshedFIOSites: Ref<TOptionalDate> = ref(undefined);
		const isRefreshingPlanets: Ref<Record<string, boolean>> = ref({});
		const isRefreshingFIO: Ref<boolean> = ref(false);

		// state reset

		function $reset(): void {
			materials.value = {};
			exchanges.value = {};
			buildings.value = {};
			planets.value = {};
			fio_storage_planets.value = {};
			fio_storage_ships.value = {};
			fio_storage_warehouses.value = {};
			fio_sites_planets.value = {};
			fio_sites_ships.value = {};
			lastRefreshedFIOStorage.value = undefined;
			lastRefreshedFIOSites.value = undefined;
			isRefreshingPlanets.value = {};
			isRefreshingFIO.value = false;
		}

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

		async function getPlanet(planetNaturalId: string): Promise<IPlanet> {
			const findPlanet: IPlanet | undefined =
				planets.value[planetNaturalId];

			if (findPlanet) return inertClone(findPlanet);

			throw new Error(
				`Planet ${planetNaturalId} not available. Make sure to load its game data.`
			);
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

		function setMaterials(data: IMaterial[]): void {
			materials.value = {};
			data.forEach((e) => {
				materials.value[e.Ticker] = e;
			});
		}

		function setExchanges(data: IExchange[]): void {
			exchanges.value = {};
			data.forEach((e) => {
				exchanges.value[e.TickerId] = e;
			});
		}

		function setRecipes(data: IRecipe[]): void {
			recipes.value = {};
			data.forEach((e) => {
				if (recipes.value[e.BuildingTicker]) {
					recipes.value[e.BuildingTicker].push(e);
				} else {
					recipes.value[e.BuildingTicker] = [e];
				}
			});
		}

		function setBuildings(data: IBuilding[]): void {
			buildings.value = {};
			data.forEach((e) => {
				buildings.value[e.Ticker] = e;
			});
		}

		function setPlanet(data: IPlanet): void {
			planets.value[data.PlanetNaturalId] = data;
		}

		function setMultiplePlanets(data: IPlanet[]): void {
			data.forEach((e) => setPlanet(e));
		}

		/// Data Loader

		async function performFIORefresh(): Promise<boolean> {
			isRefreshingFIO.value = true;

			let result: boolean = true;
			try {
				try {
					const data: IFIOStorage = await callDataFIOStorage();

					fio_storage_planets.value = data.planets;
					fio_storage_warehouses.value = data.warehouses;
					fio_storage_ships.value = data.ships;

					lastRefreshedFIOStorage.value = new Date();
				} catch (error) {
					console.error(error);
					result = false;
				}

				try {
					const data: IFIOSites = await callDataFIOSites();

					// remap data
					fio_sites_planets.value = {};

					Object.values(data.planets).forEach((sp) => {
						fio_sites_planets.value[sp.PlanetIdentifier] = sp;
					});

					fio_sites_ships.value = {};

					Object.values(data.ships).forEach((ss) => {
						fio_sites_ships.value[ss.Registration] = ss;
					});

					lastRefreshedFIOSites.value = new Date();
				} catch (error) {
					console.error(error);
					result = false;
				}
			} finally {
				isRefreshingFIO.value = false;
			}

			return result;
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
		async function performStaleDataRefresh(): Promise<void> {}

		return {
			// state
			materials,
			exchanges,
			recipes,
			buildings,
			planets,
			fio_storage_planets,
			fio_storage_warehouses,
			fio_storage_ships,
			fio_sites_planets,
			fio_sites_ships,
			lastRefreshedFIOStorage,
			lastRefreshedFIOSites,
			isRefreshingPlanets,
			isRefreshingFIO,
			// reset
			$reset,
			// setters
			setMaterials,
			setExchanges,
			setRecipes,
			setBuildings,
			setPlanet,
			setMultiplePlanets,
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
			performStaleDataRefresh,
			performFIORefresh,
			// resetter
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
				"fio_storage_planets",
				"fio_storage_warehouses",
				"fio_storage_ships",
				"fio_sites_planets",
				"fio_sites_ships",
				"lastRefreshedMaterials",
				"lastRefreshedExchanges",
				"lastRefreshedRecipes",
				"lastRefreshedBuildings",
				"lastRefreshedPlanets",
				"lastRefreshedFIOStorage",
				"lastRefreshedFIOSites",
			],

			/**
			 * Transforms types from string storage to proper formats
			 * @author jplacht
			 *
			 * @param {PiniaPluginContext} context
			 */
			afterHydrate(context) {
				const store = context.store;

				store.lastRefreshedMaterials = store.lastRefreshedMaterials
					? new Date(store.lastRefreshedMaterials)
					: undefined;
				store.lastRefreshedExchanges = store.lastRefreshedExchanges
					? new Date(store.lastRefreshedExchanges)
					: undefined;
				store.lastRefreshedRecipes = store.lastRefreshedRecipes
					? new Date(store.lastRefreshedRecipes)
					: undefined;
				store.lastRefreshedBuildings = store.lastRefreshedBuildings
					? new Date(store.lastRefreshedBuildings)
					: undefined;
				store.lastRefreshedFIOStorage = store.lastRefreshedFIOStorage
					? new Date(store.lastRefreshedFIOStorage)
					: undefined;
				store.lastRefreshedFIOSites = store.lastRefreshedFIOSites
					? new Date(store.lastRefreshedFIOSites)
					: undefined;

				if (store.lastRefreshedPlanets) {
					Object.keys(store.lastRefreshedPlanets).forEach(
						(planetNaturalId: string) => {
							store.lastRefreshedPlanets[planetNaturalId] =
								new Date(
									store.lastRefreshedPlanets[planetNaturalId]
								);
						}
					);
				}
			},
		},
	}
);
