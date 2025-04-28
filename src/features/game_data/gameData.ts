import { apiService } from "@/lib/apiService";
import {
	BuildingPayloadSchema,
	BuildingPayloadType,
	ExchangePayloadSchema,
	ExchangePayloadType,
	MaterialPayloadSchema,
	MaterialPayloadType,
	PlanetPayloadType,
	PlanetSchema,
	RecipePayloadSchema,
	RecipePayloadType,
} from "@/features/game_data/gameData.schemas";
import {
	IMaterial,
	IExchange,
	IRecipe,
	IBuilding,
	IPlanet,
} from "@/features/game_data/gameData.types";

export async function callDataMaterials(): Promise<IMaterial[]> {
	return apiService.get<MaterialPayloadType>(
		"/data/materials",
		MaterialPayloadSchema
	);
}

export async function callDataExchanges(): Promise<IExchange[]> {
	return apiService.get<ExchangePayloadType>(
		"/data/exchanges",
		ExchangePayloadSchema
	);
}

export async function callDataRecipes(): Promise<IRecipe[]> {
	return apiService.get<RecipePayloadType>(
		"/data/recipes",
		RecipePayloadSchema
	);
}

export async function callDataBuildings(): Promise<IBuilding[]> {
	return apiService.get<BuildingPayloadType>(
		"/data/buildings",
		BuildingPayloadSchema
	);
}

export async function callDataPlanet(
	planetNaturalId: string
): Promise<IPlanet> {
	return apiService.get<PlanetPayloadType>(
		`/data/planet/${planetNaturalId}`,
		PlanetSchema
	);
}
