import { computed, ComputedRef, Ref } from "vue";

// Composables
import { useMaterialData } from "@/features/game_data/useMaterialData";

// Types & Interfaces
import {
	IXITActionElement,
	IXITActionMaterialElement,
	IXITJSON,
} from "@/features/xit/xitAction.types";
import { IMaterial } from "@/features/api/gameData.types";

export function useXITAction(
	elements: Ref<IXITActionElement[]>,
	resupplyDays: Ref<number>,
	hideInfinite: Ref<boolean>,
	materialOverrides: Ref<Record<string, number>>,
	materialInactives: Ref<Set<string>>
) {
	const { getMaterial } = useMaterialData();

	/**
	 * Computes a material table to be used in a XIT Resupply Action
	 *
	 * @author jplacht
	 *
	 * @type {ComputedRef<IXITActionMaterialElement[]>}
	 */
	const materialTable: ComputedRef<IXITActionMaterialElement[]> = computed(
		() => {
			const tableElements: IXITActionMaterialElement[] = [];

			elements.value.forEach((e) => {
				let totalNeed: number = Infinity;

				if (e.delta < 0) {
					totalNeed = e.delta * -1 * resupplyDays.value - e.stock;
				}

				if (
					!hideInfinite.value ||
					(hideInfinite.value && e.delta < 0)
				) {
					const override: number | undefined =
						materialOverrides.value[e.ticker] &&
						materialOverrides.value[e.ticker] > 0
							? materialOverrides.value[e.ticker]
							: undefined;

					tableElements.push({
						active: !materialInactives.value.has(e.ticker),
						ticker: e.ticker,
						stock: e.stock,
						delta: e.delta,
						burn: e.delta > 0 ? Infinity : e.stock / (e.delta * -1),
						total: override
							? override
							: Math.ceil(totalNeed) > 0
								? Math.ceil(totalNeed)
								: 0,
					});
				}
			});

			return tableElements;
		}
	);

	/**
	 * Computes weight and volume totals for materialTable elements
	 * total amount to be used in the resupply action
	 *
	 * @author jplacht
	 *
	 * @type {ComputedRef<{
	 * 		totalWeight: number;
	 * 		totalVolume: number;
	 * 	}>}
	 */
	const totalWeightVolume: ComputedRef<{
		totalWeight: number;
		totalVolume: number;
	}> = computed(() => {
		let totalWeight: number = 0;
		let totalVolume: number = 0;

		materialTable.value.forEach((material) => {
			if (material.total !== Infinity) {
				const mat: IMaterial = getMaterial(material.ticker);

				totalWeight += mat.Weight * material.total;
				totalVolume += mat.Volume * material.total;
			}
		});

		return {
			totalWeight,
			totalVolume,
		};
	});

	/**
	 * Generates a Transfer XIT Action JSON to be used ingame
	 * @author jplacht
	 *
	 * @param {?string} [name] Action Name, will append to 'PRUNplanner'
	 * @param {?string} [origin] Transfer Origin Location
	 * @param {?string} [destination] Transfer Destination Location
	 * @returns {ComputedRef<string>} JSON String
	 */
	function generateTransferJSON(
		name?: string,
		origin?: string,
		destination?: string
	): ComputedRef<string> {
		return computed(() => {
			return JSON.stringify({
				actions: [
					{
						type: "MTRA",
						name: "TransferAction",
						group: "A1",
						origin: origin ? origin : "Configure on Execution",
						dest: destination
							? destination
							: "Configure on Execution",
					},
				],
				global: {
					name: name ? `PRUNplanner ${name}` : "PRUNplanner",
				},
				groups: [
					{
						type: "Manual",
						name: "A1",
						materials: Object.values(materialTable.value)
							.filter(
								(mt) =>
									mt.total !== Infinity &&
									mt.total > 0 &&
									mt.active
							)
							.reduce(
								(acc, item) => (
									(acc[item.ticker] = item.total), acc
								),
								{} as Record<string, number>
							),
					},
				],
			} as IXITJSON);
		});
	}

	return {
		materialTable,
		totalWeightVolume,
		generateTransferJSON,
	};
}
