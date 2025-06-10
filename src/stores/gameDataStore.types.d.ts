import {
	IMaterial,
	IExchange,
	IRecipe,
	IBuilding,
	IPlanet,
} from "@/features/api/gameData.types";

interface IMaterialsRecord extends Record<string, IMaterial> {}
interface IExchangesRecord extends Record<string, IExchange> {}
interface IRecipesRecord extends Record<string, IRecipe[]> {}
interface IBuildingsRecord extends Record<string, IBuilding> {}
interface IPlanetsRecord extends Record<string, IPlanet> {}

type TOptionalDate = undefined | Date;

interface IPlanetsLastRefreshedRecord extends Record<string, TOptionalDate> {}

interface IRefreshDataCheck {
	time: Date | undefined;
	staleMinutes: number;
	loadFunction: () => Promise<boolean>;
}
