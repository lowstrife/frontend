import { z } from "zod";
import { PositiveOrZeroNumber } from "@/util/zodValidators";
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
	IFIOStorageItem,
	IFIOSitePlanetBuildingMaterial,
	IFIOSitePlanetBuilding,
	IFIOSitePlanet,
	IFIOSites,
	IFIOSiteShip,
	IFIOSiteShipRepairMaterial,
	IFIOSiteShipAddressLine,
	IPlanetSearchAdvanced,
	IPopulationReport,
} from "@/features/api/gameData.types";

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

const RecipeMaterialSchema: z.ZodType<IRecipeMaterial> = z.object({
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

const BuildingCostSchema: z.ZodType<IBuildingCost> = z.object({
	CommodityTicker: z.string().min(1).max(3),
	Weight: PositiveOrZeroNumber,
	Volume: PositiveOrZeroNumber,
	Amount: PositiveOrZeroNumber,
});

const BuildingHabitationSchema: z.ZodType<IBuildingHabitation> = z.object({
	Pioneer: PositiveOrZeroNumber,
	Settler: PositiveOrZeroNumber,
	Technician: PositiveOrZeroNumber,
	Engineer: PositiveOrZeroNumber,
	Scientist: PositiveOrZeroNumber,
	Area: z.number().gt(0),
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
	"Invalid",
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
	ProgramType: PLANET_COGCPROGRAM_TYPE_ZOD.nullable(),
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
	Fertility: z.number(),
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

export const PlanetMultipleRequestPayload: z.ZodType<string[]> = z.array(
	z.string()
);

const FIOStorageItemSchema: z.ZodType<IFIOStorageItem> = z.object({
	MaterialId: z.string(),
	MaterialName: z.string(),
	MaterialTicker: z.string(),
	MaterialCategory: z.string(),
	MaterialWeight: z.number(),
	MaterialVolume: z.number(),
	MaterialAmount: z.number(),
	MaterialValue: z.number(),
	MaterialValueCurrency: z.string().optional(),
	Type: z.string(),
	TotalWeight: z.number(),
	TotalVolume: z.number(),
});

const FIOStorageBaseSchema = z.object({
	StorageId: z.string(),
	AddressableId: z.string(),
	Name: z.string().nullable(),
	Type: z.string(),
	UserNameSubmitted: z.string(),
	Timestamp: z.coerce.date(),
	WeightCapacity: z.number(),
	VolumeCapacity: z.number(),

	StorageItems: z.array(FIOStorageItemSchema),
});

const FIOStoragePlanetSchema = FIOStorageBaseSchema.extend({
	PlanetId: z.string(),
	PlanetIdentifier: z.string(),
	PlanetName: z.string().optional(),
	WeightLoad: z.number(),
	VolumeLoad: z.number(),
});

const FIOStorageWarehouseSchema = FIOStorageBaseSchema.extend({
	LocationNaturalId: z.string(),
	LocationName: z.string().nullable(),
	WarehouseId: z.string().nullable(),
	Units: z.number().nullable(),
	NextPaymentTimestampEpochMs: z.number().nullable(),
	FeeAmount: z.number().nullable(),
	FeeCurrency: z.string().nullable(),
	FeeCollectorId: z.string().nullable(),
	FeeCollectorName: z.string().nullable(),
	FeeCollectorCode: z.string().nullable(),
});

const FIOStorageShipSchema = FIOStorageBaseSchema.extend({
	WeightLoad: z.number(),
	VolumeLoad: z.number(),
	Registration: z.string(),
});

export const FIOStorageSchema = z.object({
	planets: z.record(z.string(), FIOStoragePlanetSchema),
	warehouses: z.record(z.string(), FIOStorageWarehouseSchema),
	ships: z.record(z.string(), FIOStorageShipSchema),
});

const FIOSitePlanetBuildingMaterialSchema: z.ZodType<IFIOSitePlanetBuildingMaterial> =
	z.object({
		MaterialId: z.string(),
		MaterialName: z.string(),
		MaterialTicker: z.string(),
		MaterialAmount: PositiveOrZeroNumber,
	});

const FIOSitePlanetBuildingSchema: z.ZodType<IFIOSitePlanetBuilding> = z.object(
	{
		SiteBuildingId: z.string(),
		BuildingId: z.string(),
		BuildingCreated: z.coerce.date(),
		BuildingName: z.string(),
		BuildingTicker: z.string(),
		BuildingLastRepair: z.coerce.date().optional(),
		Condition: z.number(),
		ReclaimableMaterials: z.array(FIOSitePlanetBuildingMaterialSchema),
		RepairMaterials: z.array(FIOSitePlanetBuildingMaterialSchema),
		AgeDays: z.number().nullable(),
	}
);

const FIOSitePlanetSchema: z.ZodType<IFIOSitePlanet> = z.object({
	SiteId: z.string(),
	PlanetId: z.string(),
	PlanetIdentifier: z.string(),
	PlanetName: z.string(),
	PlanetFoundedEpochMs: z.number(),
	InvestedPermits: z.number(),
	MaximumPermits: z.number(),
	UserNameSubmitted: z.string(),
	Timestamp: z.coerce.date(),
	Buildings: z.array(FIOSitePlanetBuildingSchema),
});

const FIOSiteShipRepairMaterialSchema: z.ZodType<IFIOSiteShipRepairMaterial> =
	z.object({
		ShipRepairMaterialId: z.string(),
		MaterialName: z.string(),
		MaterialId: z.string(),
		MaterialTicker: z.string(),
		Amount: PositiveOrZeroNumber,
	});

const FIOSiteShipAddressLineSchema: z.ZodType<IFIOSiteShipAddressLine> =
	z.object({
		LineId: z.string(),
		LineType: z.string(),
		NaturalId: z.string(),
		Name: z.string(),
	});

const FIOSiteShipSchema: z.ZodType<IFIOSiteShip> = z.object({
	ShipId: z.string(),
	StoreId: z.string(),
	StlFuelStoreId: z.string(),
	FtlFuelStoreId: z.string(),
	Registration: z.string(),
	Name: z.string().optional(),
	CommissioningTimeEpochMs: z.number(),
	Condition: z.number(),
	LastRepairEpochMs: z.number().nullable(),
	Location: z.string(),
	RepairMaterials: z.array(FIOSiteShipRepairMaterialSchema),
	AddressLines: z.array(FIOSiteShipAddressLineSchema),
});

export const FIOSitesSchema: z.ZodType<IFIOSites> = z.object({
	planets: z.record(z.string(), FIOSitePlanetSchema),
	ships: z.record(z.string(), FIOSiteShipSchema),
});

export const PlanetSearchAdvancedPayloadSchema: z.ZodType<IPlanetSearchAdvanced> =
	z.object({
		Materials: z.array(z.string().min(1).max(3)),
		COGC: z.array(PLANET_COGCPROGRAM_TYPE_ZOD),
		IncludeRocky: z.boolean(),
		IncludeGaseous: z.boolean(),
		IncludeLowGravity: z.boolean(),
		IncludeHighGravity: z.boolean(),
		IncludeLowPressure: z.boolean(),
		IncludeHighPressure: z.boolean(),
		IncludeLowTemperature: z.boolean(),
		IncludeHighTemperature: z.boolean(),
		MustBeFertile: z.boolean(),
		MustHaveLocalMarket: z.boolean(),
		MustHaveChamberOfCommerce: z.boolean(),
		MustHaveWarehouse: z.boolean(),
		MustHaveAdministrationCenter: z.boolean(),
		MustHaveShipyard: z.boolean(),
		MaxDistanceCheck: z
			.object({ SystemId: z.string(), MaxDistance: PositiveOrZeroNumber })
			.optional(),
	});

export const PopulationReportPayloadSchema: z.ZodType<IPopulationReport> =
	z.object({
		InfrastructureReportId: z.string(),
		ExplorersGraceEnabled: z.boolean(),
		SimulationPeriod: z.number().int(),
		NextPopulationPioneer: z.number().int(),
		NextPopulationSettler: z.number().int(),
		NextPopulationTechnician: z.number().int(),
		NextPopulationEngineer: z.number().int(),
		NextPopulationScientist: z.number().int(),
		PopulationDifferencePioneer: z.number().int(),
		PopulationDifferenceSettler: z.number().int(),
		PopulationDifferenceTechnician: z.number().int(),
		PopulationDifferenceEngineer: z.number().int(),
		PopulationDifferenceScientist: z.number().int(),
		UnemploymentRatePioneer: z.number(),
		UnemploymentRateSettler: z.number(),
		UnemploymentRateTechnician: z.number(),
		UnemploymentRateEngineer: z.number(),
		UnemploymentRateScientist: z.number(),
		OpenJobsPioneer: z.number(),
		OpenJobsSettler: z.number(),
		OpenJobsTechnician: z.number(),
		OpenJobsEngineer: z.number(),
		OpenJobsScientist: z.number(),
		TimestampMs: z.iso.datetime().transform((arg) => new Date(arg)),
		FreePioneer: z.number().int(),
		FreeSettler: z.number().int(),
		FreeTechnician: z.number().int(),
		FreeEngineer: z.number().int(),
		FreeScientist: z.number().int(),
	});

// Schema Types
export type MaterialPayloadType = z.infer<typeof MaterialPayloadSchema>;
export type BuildingPayloadType = z.infer<typeof BuildingPayloadSchema>;
export type ExchangePayloadType = z.infer<typeof ExchangePayloadSchema>;
export type RecipePayloadType = z.infer<typeof RecipePayloadSchema>;
export type PlanetPayloadType = z.infer<typeof PlanetSchema>;
export type PlanetMultiplePayloadType = z.infer<typeof PlanetMultiplePayload>;
export type PlanetMultipleRequestType = z.infer<
	typeof PlanetMultipleRequestPayload
>;
export type FIOStoragePayloadType = z.infer<typeof FIOStorageSchema>;
export type FIOSitesSchemaPayloadType = z.infer<typeof FIOSitesSchema>;
export type PlanetSearchAdvancedPayloadType = z.infer<
	typeof PlanetSearchAdvancedPayloadSchema
>;
export type PopulationReportPayloadType = z.infer<
	typeof PopulationReportPayloadSchema
>;
