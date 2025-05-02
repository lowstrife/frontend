// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Interfaces & Types
import {
	EXCHANGES_TYPE,
	IMaterialExchangeOverview,
} from "@/features/game_data/useMaterialData.types";
import { IExchange } from "@/features/game_data/gameData.types";

export function useExchangeData() {
	const gameDataStore = useGameDataStore();

	const exchangeTypesArray: EXCHANGES_TYPE[] = ["AI1", "CI1", "IC1", "NC1"];

	/**
	 * Gets exchange information for given Exchange Ticker
	 * @author jplacht
	 *
	 * @param {string} tickerId Exchange Ticker, e.g. "DW.AI1"
	 * @returns {IExchange} Exchange data
	 */
	function getExchangeTicker(tickerId: string): IExchange {
		if (!Object.keys(gameDataStore.exchanges).includes(tickerId)) {
			throw new Error(
				`Exchange data for ticker '${tickerId}' not found. Ensure game data is loaded and ticker is valid.`
			);
		}

		return gameDataStore.exchanges[tickerId];
	}

	/**
	 * Gets overview of exchange data for given material ticker
	 * @author jplacht
	 *
	 * @param {string} materialTicker Material Ticker, e.g. "DW"
	 * @returns {IMaterialExchangeOverview} Structured Exchange overview
	 */
	function getMaterialExchangeOverview(
		materialTicker: string
	): IMaterialExchangeOverview {
		const overview: IMaterialExchangeOverview = {
			Ask: {} as Required<Record<EXCHANGES_TYPE, number>>,
			Bid: {} as Record<EXCHANGES_TYPE, number>,
			Average: {} as Record<EXCHANGES_TYPE, number>,
			PP7D: {} as Record<EXCHANGES_TYPE, number>,
			PP30D: {} as Record<EXCHANGES_TYPE, number>,
			Supply: {} as Record<EXCHANGES_TYPE, number>,
			Demand: {} as Record<EXCHANGES_TYPE, number>,
			Universe7D: getExchangeTicker(`${materialTicker}.PP7D_UNIVERSE`)
				.PriceAverage,
			Universe30D: getExchangeTicker(`${materialTicker}.PP30D_UNIVERSE`)
				.PriceAverage,
		};

		exchangeTypesArray.forEach((type) => {
			const ticker = getExchangeTicker(`${materialTicker}.${type}`);
			overview.Ask[type] = ticker.Ask ?? 0;
			overview.Bid[type] = ticker.Bid ?? 0;
			overview.Average[type] = ticker.PriceAverage;
			overview.PP7D[type] = ticker.PriceAverage;
			overview.PP30D[type] = ticker.PriceAverage;
			overview.Supply[type] = ticker.Supply ?? 0;
			overview.Demand[type] = ticker.Demand ?? 0;
		});

		return overview;
	}

	return {
		exchangeTypesArray,
		getExchangeTicker,
		getMaterialExchangeOverview,
	};
}
