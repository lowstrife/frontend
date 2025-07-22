import { IBuilding, IRecipe } from "@/features/api/gameData.types";
import { IBuildingEfficiency } from "@/features/planning/calculations/bonusCalculations.types";
import { PLAN_COGCPROGRAM_TYPE } from "@/stores/planningStore.types";

export type WORKFORCE_TYPE =
	| "pioneer"
	| "settler"
	| "technician"
	| "engineer"
	| "scientist";

export type INFRASTRUCTURE_TYPE =
	| "HB1"
	| "HB2"
	| "HB3"
	| "HB4"
	| "HB5"
	| "HBB"
	| "HBC"
	| "HBM"
	| "HBL"
	| "STO";

export type EXPERT_TYPE =
	| "Agriculture"
	| "Chemistry"
	| "Construction"
	| "Electronics"
	| "Food_Industries"
	| "Fuel_Refining"
	| "Manufacturing"
	| "Metallurgy"
	| "Resource_Extraction";

export interface IWorkforceElement {
	name: WORKFORCE_TYPE;
	required: number;
	capacity: number;
	left: number;
	lux1: boolean;
	lux2: boolean;
	efficiency: number;
}

export interface IAreaResult {
	permits: number;
	areaUsed: number;
	areaTotal: number;
	areaLeft: number;
}

export interface IExpertElement {
	name: EXPERT_TYPE;
	amount: number;
	bonus: number;
}

export type IWorkforceRecord = Required<
	Record<WORKFORCE_TYPE, IWorkforceElement>
>;

export type IInfrastructureRecord = Required<
	Record<INFRASTRUCTURE_TYPE, number>
>;

export type IExpertRecord = Required<Record<EXPERT_TYPE, IExpertElement>>;

export interface IRecipeBuildingOption extends IRecipe {
	dailyRevenue: number;
	roi: number;
}

export interface IProductionBuildingRecipe {
	recipeId: string;
	amount: number;
	recipe: IRecipeBuildingOption;
	dailyShare: number;
	time: number;
}

export interface IProductionBuilding {
	name: string;
	amount: number;
	activeRecipes: IProductionBuildingRecipe[];
	recipeOptions: IRecipeBuildingOption[];
	totalEfficiency: number;
	efficiencyElements: IBuildingEfficiency[];
	totalBatchTime: number;
	constructionMaterials: IMaterialIOMinimal[];
	constructionCost: number;
	workforceMaterials: IMaterialIOMinimal[];
	workforceDailyCost: number;
	dailyRevenue: number;
}

export interface IProductionResult {
	buildings: IProductionBuilding[];
	materialio: IMaterialIOMinimal[];
}
export interface IMaterialIOMinimal {
	ticker: string;
	input: number;
	output: number;
}

export interface IMaterialIOMaterial extends IMaterialIOMinimal {
	delta: number;
	individualWeight: number;
	individualVolume: number;
	totalWeight: number;
	totalVolume: number;
}

export interface IMaterialIO extends IMaterialIOMaterial {
	price: number;
}

export interface IPlanResult {
	corphq: boolean;
	cogc: PLAN_COGCPROGRAM_TYPE;
	workforce: IWorkforceRecord;
	area: IAreaResult;
	infrastructure: IInfrastructureRecord;
	experts: IExpertRecord;
	production: IProductionResult;
	materialio: IMaterialIO[];
	workforceMaterialIO: IMaterialIO[];
	productionMaterialIO: IMaterialIO[];
	profit: number;
	cost: number;
	revenue: number;
}

// Procomputational values
interface IPreBuildingInformation {
	ticker: string;
	buildingData: IBuilding;
	buildingRecipes: IRecipe[];
	constructionMaterials: IMaterialIOMinimal[];
	constructionCost: number;
	workforceMaterials: IMaterialIOMinimal[];
}

export type IPreBuildingRecord = Record<string, IPreBuildingInformation>;
