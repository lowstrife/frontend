import { PositiveOrZeroNumber } from "@/util/zodValidators";
import { z } from "zod";
import {
	IMaterial,
	IExchange,
	IRecipeMaterial,
	IRecipe,
	IBuildingCost,
	IBuildingHabitation,
	IBuilding,
	IPlanetDistance,
	IPlanetResource,
	IPlanetCOGCProgram,
	IPlanet,
	IPlanetCheckDistance,
} from "@/features/game_data/gameData.types";

// Schemas
export const MaterialSchema: z.ZodType<IMaterial> = z.object({
	MaterialId: z.string(),
	CategoryName: z.string(),
	CategoryId: z.string(),
	Name: z.string(),
	Ticker: z.string().min(1).max(3),
	Weight: z.number(),
	Volume: z.number(),
});

export const MaterialPayloadSchema: z.ZodType<IMaterial[]> =
	z.array(MaterialSchema);

export const ExchangeSchema: z.ZodType<IExchange> = z.object({
	TickerId: z.string(),
	MaterialTicker: z.string().min(1).max(3),
	ExchangeCode: z.string(),
	Ask: z.number().nullable(),
	Bid: z.number().nullable(),
	PriceAverage: z.number(),
	Supply: z.number().nullable(),
	Demand: z.number().nullable(),
	Traded: z.number().nullable(),
});

export const ExchangePayloadSchema: z.ZodType<IExchange[]> =
	z.array(ExchangeSchema);

export const RecipeMaterialSchema: z.ZodType<IRecipeMaterial> = z.object({
	Ticker: z.string().min(1).max(3),
	Amount: PositiveOrZeroNumber,
});

export const RecipeSchema: z.ZodType<IRecipe> = z.object({
	RecipeId: z.string(),
	BuildingTicker: z.string().min(2).max(3),
	RecipeName: z.string(),
	TimeMs: z.number(),
	Inputs: z.array(RecipeMaterialSchema),
	Outputs: z.array(RecipeMaterialSchema),
});

export const RecipePayloadSchema: z.ZodType<IRecipe[]> = z.array(RecipeSchema);

export const BuildingCostSchema: z.ZodType<IBuildingCost> = z.object({
	CommodityTicker: z.string().min(1).max(3),
	Weight: PositiveOrZeroNumber,
	Volume: PositiveOrZeroNumber,
	Amount: PositiveOrZeroNumber,
});

export const BuildingHabitationSchema: z.ZodType<IBuildingHabitation> =
	z.object({
		Pioneer: PositiveOrZeroNumber,
		Settler: PositiveOrZeroNumber,
		Technician: PositiveOrZeroNumber,
		Engineer: PositiveOrZeroNumber,
		Scientist: PositiveOrZeroNumber,
	});

const BUILDING_TYPE_ZOD = z.enum(["INFRASTRUCTURE", "PLANETARY", "PRODUCTION"]);
const EXPERTISE_TYPE_ZOD = z.enum([
	"AGRICULTURE",
	"CHEMISTRY",
	"CONSTRUCTION",
	"ELECTRONICS",
	"FOOD_INDUSTRIES",
	"FUEL_REFINING",
	"MANUFACTURING",
	"METALLURGY",
	"RESOURCE_EXTRACTION",
]);

export const BuildingSchema: z.ZodType<IBuilding> = z.object({
	Name: z.string(),
	Ticker: z.string().min(2).max(3),
	Expertise: EXPERTISE_TYPE_ZOD.nullable(),
	Pioneers: PositiveOrZeroNumber,
	Settlers: PositiveOrZeroNumber,
	Technicians: PositiveOrZeroNumber,
	Engineers: PositiveOrZeroNumber,
	Scientists: PositiveOrZeroNumber,
	AreaCost: PositiveOrZeroNumber,
	BuildingCosts: z.array(BuildingCostSchema),
	Habitation: BuildingHabitationSchema.nullable(),
	Type: BUILDING_TYPE_ZOD,
});

export const BuildingPayloadSchema: z.ZodType<IBuilding[]> =
	z.array(BuildingSchema);

const PLANET_RESOURCETYPE_TYPE_ZOD = z.enum(["MINERAL", "GASEOUS", "LIQUID"]);

const PlanetResourceSchema: z.ZodType<IPlanetResource> = z.object({
	MaterialId: z.string().min(32).max(32),
	ResourceType: PLANET_RESOURCETYPE_TYPE_ZOD,
	Factor: z.number(),
	DailyExtraction: z.number(),
	MaterialTicker: z.string().min(1).max(3),
	ExtractionMax: z.number(),
});

const PLANET_DISTANCE_NAMES_ZOD = z.enum([
	"Moria Station",
	"Antares Station",
	"Benten Station",
	"Hortus Station",
]);

const PlanetDistanceSchema: z.ZodType<IPlanetDistance> = z.object({
	name: PLANET_DISTANCE_NAMES_ZOD,
	distance: PositiveOrZeroNumber,
});

const PlanetCheckDistanceSchema: z.ZodType<IPlanetCheckDistance> = z.object({
	SystemIdStart: z.string().min(32).max(32),
	SystemIdTarget: z.string().min(32).max(32),
	SystemName: z.string(),
	Distance: PositiveOrZeroNumber,
});

const PLANET_COGCPROGRAM_TYPE_ZOD = z.enum([
	"ADVERTISING_AGRICULTURE",
	"ADVERTISING_CHEMISTRY",
	"ADVERTISING_CONSTRUCTION",
	"ADVERTISING_ELECTRONICS",
	"ADVERTISING_FOOD_INDUSTRIES",
	"ADVERTISING_FUEL_REFINING",
	"ADVERTISING_MANUFACTURING",
	"ADVERTISING_METALLURGY",
	"ADVERTISING_RESOURCE_EXTRACTION",
	"WORKFORCE_PIONEERS",
	"WORKFORCE_SETTLERS",
	"WORKFORCE_TECHNICIANS",
	"WORKFORCE_ENGINEERS",
	"WORKFORCE_SCIENTISTS",
]);

const PlanetCOGCProgramSchema: z.ZodType<IPlanetCOGCProgram> = z.object({
	ProgramType: PLANET_COGCPROGRAM_TYPE_ZOD,
	StartEpochMs: z.number(),
	EndEpochMs: z.number(),
});

const PLANET_COGCPGROGRAM_STATUS_TYPE_ZOD = z.enum([
	"ACTIVE",
	"ON_STRIKE",
	"PLANNED",
]);

export const PlanetSchema: z.ZodType<IPlanet> = z.object({
	PlanetId: z.string().min(32).max(32),
	PlanetNaturalId: z.string(),
	PlanetName: z.string(),
	SystemId: z.string().min(32).max(32),
	HasLocalMarket: z.boolean(),
	HasChamberOfCommerce: z.boolean(),
	HasWarehouse: z.boolean(),
	HasAdministrationCenter: z.boolean(),
	HasShipyard: z.boolean(),
	Pressure: z.number(),
	Surface: z.boolean(),
	Temperature: z.number(),
	Gravity: z.number(),
	FactionCode: z.string().nullable(),
	FactionName: z.string().nullable(),
	GovernorUserName: z.string().nullable(),
	COGCProgramStatus: PLANET_COGCPGROGRAM_STATUS_TYPE_ZOD.nullable(),

	Resources: z.array(PlanetResourceSchema),
	Distances: z.array(PlanetDistanceSchema),
	COGCPrograms: z.array(PlanetCOGCProgramSchema),
	COGCProgramActive: PLANET_COGCPROGRAM_TYPE_ZOD.nullable(),
	CheckDistances: PlanetCheckDistanceSchema.nullable(),
});

export const PlanetMultiplePayload: z.ZodType<IPlanet[]> =
	z.array(PlanetSchema);

// Schema Types
export type MaterialType = z.infer<typeof MaterialSchema>;
export type MaterialPayloadType = z.infer<typeof MaterialPayloadSchema>;
export type ExchangeType = z.infer<typeof ExchangeSchema>;
export type ExchangePayloadType = z.infer<typeof ExchangePayloadSchema>;
export type RecipeType = z.infer<typeof RecipeSchema>;
export type RecipePayloadType = z.infer<typeof RecipePayloadSchema>;
export type BuildingType = z.infer<typeof BuildingSchema>;
export type BuildingPayloadType = z.infer<typeof BuildingPayloadSchema>;
export type PlanetType = z.infer<typeof PlanetSchema>;
export type PlanetPayloadType = z.infer<typeof PlanetSchema>;
export type PlanetMultiplePayloadType = z.infer<typeof PlanetMultiplePayload>;
