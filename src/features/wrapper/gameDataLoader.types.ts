import {
	IBuilding,
	IExchange,
	IMaterial,
	IPlanet,
	IRecipe,
} from "@/features/api/gameData.types";
import { StepConfig } from "./dataLoader.types";

export type GameDataLoaderProps = {
	readonly minimal?: boolean | undefined;
	readonly loadMaterials?: boolean | undefined;
	readonly loadExchanges?: boolean | undefined;
	readonly loadBuildings?: boolean | undefined;
	readonly loadRecipes?: boolean | undefined;
	readonly loadPlanet?: string | undefined;
	readonly loadPlanetMultiple?: string[] | undefined;
};

export type GameDataLoaderEmits = {
	(e: "complete"): void;
	(e: "data:materials", data: IMaterial[]): void;
	(e: "data:exchanges", data: IExchange[]): void;
	(e: "data:buildings", data: IBuilding[]): void;
	(e: "data:recipes", data: IRecipe[]): void;
	(e: "data:planet", data: IPlanet): void;
	(e: "data:planet:multiple", data: IPlanet[]): void;
};

export type GameDataStepConfigsType = [
	StepConfig<IMaterial[]>,
	StepConfig<IExchange[]>,
	StepConfig<IBuilding[]>,
	StepConfig<IRecipe[]>,
	StepConfig<IPlanet>,
	StepConfig<IPlanet[]>,
];
