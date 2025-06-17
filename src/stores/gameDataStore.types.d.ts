import {
	IMaterial,
	IExchange,
	IRecipe,
	IBuilding,
	IPlanet,
} from "@/features/api/gameData.types";

type IMaterialsRecord = Record<string, IMaterial>;
type IExchangesRecord = Record<string, IExchange>;
type IRecipesRecord = Record<string, IRecipe[]>;
type IBuildingsRecord = Record<string, IBuilding>;
type IPlanetsRecord = Record<string, IPlanet>;

type TOptionalDate = undefined | Date;

type IPlanetsLastRefreshedRecord = Record<string, TOptionalDate>;

interface IRefreshDataCheck {
	time: Date | undefined;
	staleMinutes: number;
	loadFunction: () => Promise<boolean>;
}
