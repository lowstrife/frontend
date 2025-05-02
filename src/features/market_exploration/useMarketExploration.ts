// Services
import { apiService } from "@/lib/apiService";

// Util
import { formatDate } from "@/util/date";

// Types & Interfaces
import {
	IExploration,
	IExplorationRequestPayload,
	IMaterialExplorationRecord,
} from "@/features/market_exploration/marketExploration.types";
import {
	ExplorationPayloadSchema,
	ExplorationPayloadType,
	ExplorationRequestPayloadSchema,
	ExplorationRequestPayloadType,
} from "@/features/market_exploration/marketExploration.schemas";

export function useMarketExploration() {
	/**
	 * Calls the market exploration endpoint to fetch data
	 * @author jplacht
	 *
	 * @async
	 * @param {string} exchange Exchange Code
	 * @param {string} ticker Material Ticker
	 * @param {IExplorationRequestPayload} payload Payload with start and end date
	 * @returns {Promise<IExploration[]>} Exploration data
	 */
	async function callExplorationData(
		exchange: string,
		ticker: string,
		payload: IExplorationRequestPayload
	): Promise<IExploration[]> {
		return apiService.post<
			ExplorationRequestPayloadType,
			ExplorationPayloadType
		>(
			`/data/market/${exchange}/${ticker}`,
			payload,
			ExplorationRequestPayloadSchema,
			ExplorationPayloadSchema
		);
	}

	/**
	 * Requests last 7 days of exploration data for
	 * AI1, CI1, IC1, NC1 for single material ticker
	 * @author jplacht
	 *
	 * @async
	 * @param {string} ticker Material Ticker, e.g. "DW"
	 * @returns {Promise<IMaterialExplorationRecord>} Exploration Data of last 7 days
	 */
	async function getMaterialExplorationData(
		ticker: string
	): Promise<IMaterialExplorationRecord> {
		const data: IMaterialExplorationRecord = {
			AI1: [],
			CI1: [],
			IC1: [],
			NC1: [],
		};

		const todayString: string = formatDate(new Date());
		const sevenAgoString: string = formatDate(
			new Date(new Date().setDate(new Date().getDate() - 7))
		);

		const fetchPayload: IExplorationRequestPayload = {
			start: sevenAgoString,
			end: todayString,
		};

		// fetch multiple exploration data
		const fetchPromises: Promise<IExploration[]>[] = [
			callExplorationData("AI1", ticker, fetchPayload).then(
				(result: IExploration[]) => (data["AI1"] = result)
			),
			callExplorationData("CI1", ticker, fetchPayload).then(
				(result: IExploration[]) => (data["CI1"] = result)
			),
			callExplorationData("IC1", ticker, fetchPayload).then(
				(result: IExploration[]) => (data["IC1"] = result)
			),
			callExplorationData("NC1", ticker, fetchPayload).then(
				(result: IExploration[]) => (data["NC1"] = result)
			),
		];

		await Promise.all(fetchPromises);

		return data;
	}

	return {
		callExplorationData,
		getMaterialExplorationData,
	};
}
