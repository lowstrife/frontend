// services
import { apiService } from "@/lib/apiService";

// schemas
import {
	BuildingPayloadSchema,
	BuildingPayloadType,
	ExchangePayloadSchema,
	ExchangePayloadType,
	MaterialPayloadSchema,
	MaterialPayloadType,
	PlanetMultiplePayload,
	PlanetMultiplePayloadType,
	PlanetMultipleRequestPayload,
	PlanetMultipleRequestType,
	PlanetPayloadType,
	PlanetSchema,
	RecipePayloadSchema,
	RecipePayloadType,
} from "@/features/game_data/gameData.schemas";

// types
import {
	IMaterial,
	IExchange,
	IRecipe,
	IBuilding,
	IPlanet,
} from "@/features/game_data/gameData.types";

/**
 * Calls the /data/materials API endpoint
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<IMaterial[]>} List of Materials
 */
export async function callDataMaterials(): Promise<IMaterial[]> {
	return apiService.get<MaterialPayloadType>(
		"/data/materials",
		MaterialPayloadSchema
	);
}

/**
 * Calls the /data/exchanges API endpoint
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<IExchange[]>} List of Exchange Data
 */
export async function callDataExchanges(): Promise<IExchange[]> {
	return apiService.get<ExchangePayloadType>(
		"/data/exchanges",
		ExchangePayloadSchema
	);
}

/**
 * Calls the /data/recipes API endpoint
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<IRecipe[]>} List of Recipes
 */
export async function callDataRecipes(): Promise<IRecipe[]> {
	return apiService.get<RecipePayloadType>(
		"/data/recipes",
		RecipePayloadSchema
	);
}

/**
 * Calls the /data/buildings API endpoint
 * @author jplacht
 *
 * @export
 * @async
 * @returns {Promise<IBuilding[]>} List of Buildings
 */
export async function callDataBuildings(): Promise<IBuilding[]> {
	return apiService.get<BuildingPayloadType>(
		"/data/buildings",
		BuildingPayloadSchema
	);
}

/**
 * Calls the /data/planet API endpoint to fetch a single
 * planets data
 * @author jplacht
 *
 * @export
 * @async
 * @param {string} planetNaturalId Planet Natural Id ('OT-580b')
 * @returns {Promise<IPlanet>} Planet Data
 */
export async function callDataPlanet(
	planetNaturalId: string
): Promise<IPlanet> {
	return apiService.get<PlanetPayloadType>(
		`/data/planet/${planetNaturalId}`,
		PlanetSchema
	);
}

/**
 * Calls the /data/planet/multiple API endpoint to fetch
 * multiple planets and their data
 * @author jplacht
 *
 * @export
 * @async
 * @param {string[]} planetNaturalIds List of Planet Natural Ids (['OT-580b', 'ZV-759c'])
 * @returns {Promise<IPlanet[]>} List of Planets Data
 */
export async function callDataMultiplePlanets(
	planetNaturalIds: string[]
): Promise<IPlanet[]> {
	return apiService.post<PlanetMultipleRequestType, PlanetMultiplePayloadType>(
		"/data/planet/multiple",
		planetNaturalIds,
		PlanetMultipleRequestPayload,
		PlanetMultiplePayload
	);
}
