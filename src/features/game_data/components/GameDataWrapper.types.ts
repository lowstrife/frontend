export enum LOADING_STATUS_ENUM {
	SKIP = "SKIP",
	LOAD = "LOAD",
	DONE = "DONE",
	ERROR = "ERROR",
}

export interface WrapperLoaderElement {
	name: string;
	status: LOADING_STATUS_ENUM;
}

export type WrapperLoaderTypes =
	| "MATERIALS"
	| "EXCHANGES"
	| "RECIPES"
	| "BUILDINGS"
	| "PLANET"
	| "MULTIPLE_PLANETS";

export interface WrapperLoader {
	[WrapperLoaderTypes: string]: WrapperLoaderElement;
}

export interface WrapperTask {
	prop: boolean | string | string[] | undefined;
	statusKey: WrapperLoaderTypes;
	fct: () => Promise<boolean>;
}
