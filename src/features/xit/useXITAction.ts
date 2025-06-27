import { computed, ComputedRef } from "vue";

// Types & Interfaces
import { IXITJSON, IXITTransferMaterial } from "@/features/xit/xitAction.types";

export function useXITAction() {
	/**
	 * Generates a XIT Transfer action with given materials and options
	 *
	 * @author jplacht
	 *
	 * @param {IXITTransferMaterial[]} materials Materials to Transfer
	 * @param {?{
	 * 			name?: string;
	 * 			origin?: string;
	 * 			destination?: string;
	 * 		}} [options] Transfer Optons
	 * @returns {ComputedRef<string>} JSON string
	 */
	function transferJSON(
		materials: IXITTransferMaterial[],
		options?: {
			name?: string;
			origin?: string;
			destination?: string;
		}
	): ComputedRef<string> {
		return computed(() => {
			const actionFormat: IXITJSON = {
				actions: [
					{
						type: "MTRA",
						name: "TransferAction",
						group: "A1",
						origin:
							options && options.origin
								? options.origin
								: "Configure on Execution",
						dest:
							options && options.destination
								? options.destination
								: "Configure on Execution",
					},
				],
				global: {
					name:
						options && options.name
							? `PRUNplanner ${options.name}`
							: "PRUNplanner",
				},
				groups: [
					{
						type: "Manual",
						name: "A1",
						materials: materials.reduce(
							(acc, item) => (
								(acc[item.ticker] = item.value), acc
							),
							{} as Record<string, number>
						),
					},
				],
			};

			return JSON.stringify(actionFormat);
		});
	}

	return {
		transferJSON,
	};
}
