export interface IPlanetSearchResult {
	planetId: string;
	planetName: string;
	fertility: number;
	cogcProgram: string;
	distanceAI1: number;
	distanceCI1: number;
	distanceIC1: number;
	distanceNC1: number;
	checkDistance: number | null;
	searchResources: Record<string, IPlanetSearchResultResource>;
	additionalResources: IPlanetSearchResultResource[];
	environmentSurface: string[];
	environmentGravity: string[];
	environmentPressure: string[];
	environmentTemperature: string[];
	infrastructures: string[];
}

export interface IPlanetSearchResultResource {
	ticker: string;
	dailyExtraction: number;
	maxExtraction: number;
}
