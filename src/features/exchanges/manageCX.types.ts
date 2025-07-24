import {
	ICXDataExchangeOption,
	ICXDataTickerOption,
} from "@/stores/planningStore.types";

export type PreferenceType = "BOTH" | "BUY" | "SELL";

export type ExchangeType =
	| "AI1_BUY"
	| "AI1_SELL"
	| "AI1_AVG"
	| "IC1_BUY"
	| "IC1_SELL"
	| "IC1_AVG"
	| "CI1_BUY"
	| "CI1_SELL"
	| "CI1_AVG"
	| "CI2_BUY"
	| "CI2_SELL"
	| "CI2_AVG"
	| "NC1_BUY"
	| "NC1_SELL"
	| "NC1_AVG"
	| "NC2_BUY"
	| "NC2_SELL"
	| "NC2_AVG"
	| "PP7D_AI1"
	| "PP7D_IC1"
	| "PP7D_CI1"
	| "PP7D_CI2"
	| "PP7D_NC1"
	| "PP7D_NC2"
	| "PP30D_AI1"
	| "PP30D_IC1"
	| "PP30D_CI1"
	| "PP30D_CI2"
	| "PP30D_NC1"
	| "PP30D_NC2"
	| "PP7D_UNIVERSE"
	| "PP30D_UNIVERSE";

export type ICXPlanetMapItem = {
	planet: string;
	exchanges: ICXDataExchangeOption[];
	ticker: ICXDataTickerOption[];
};

export type ICXPlanetMap = Record<string, ICXPlanetMapItem>;
