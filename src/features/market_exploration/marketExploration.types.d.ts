export interface IExploration {
	Datetime: string;
	ExchangeCode: string;
	Ticker: string;
	price_first: number;
	price_last: number;
	price_average: number;
	price_min: number;
	price_max: number;
	volume_max: number;
	demand_average: number;
	supply_average: number;
	delta_supply_demand: number;

	[key: string]: string | number;
}

export interface IExplorationRequestPayload {
	start: string;
	end: string;
}

export interface IMaterialExplorationRecord
	extends Record<string, IExploration[]> {}
