import { computed, ref, Ref } from "vue";

// Composables
import { usePrice } from "@/features/cx/usePrice";

// Util
import { getUpkeepByEffect } from "@/features/government/government.util";

// Types & Interfaces
import { POPIEffect } from "@/features/government/government.types";
import {
	IGovUpkeepPriceElement,
	IGovUpkeepPricePre,
	IGovUpkeepPrice,
} from "@/features/government/useUpkeepPrice.types";
import { IGovUpkeepEffect } from "@/features/government/government.util.types";

export function useUpkeepPrice(cxUuid: Ref<string | undefined>) {
	const { getPrice } = usePrice(cxUuid, ref(undefined));

	/**
	 * Calculates the effect price data and optimal material to provide
	 * to fulfill requested population upkeep
	 *
	 * @author jplacht
	 *
	 * @param {POPIEffect} effect POPI Effect
	 * @returns {IGovUpkeepPrice} Effect Data and Materials
	 */
	function calculateEffect(effect: POPIEffect): IGovUpkeepPrice {
		const pre: IGovUpkeepPricePre[] = [];
		const effectData: IGovUpkeepEffect[] = getUpkeepByEffect(effect);

		console.log(effectData);

		//
		effectData.forEach((data) => {
			const materialPrice: number = getPrice(data.material, "BUY");
			const effectPerQty: number = data.effectValue / data.qtyDay;

			pre.push({
				building: data.building,
				material: data.material,
				effect,
				pricePerEffect: materialPrice / effectPerQty,
				materialPrice,
			});
		});

		const minimumElement: IGovUpkeepPricePre = pre.reduce((min, item) => {
			return item.pricePerEffect < min.pricePerEffect ? item : min;
		}, pre[0]);

		const result: IGovUpkeepPriceElement[] = pre
			.map((element) => ({
				...element,
				priceRelative:
					(element.materialPrice / element.pricePerEffect) *
					minimumElement.pricePerEffect,
			}))
			.sort((a, b) => (a.pricePerEffect > b.pricePerEffect ? 1 : -1));

		return {
			effect,
			minBuilding: minimumElement.building,
			minMaterial: minimumElement.material,
			minPricePerEffect: minimumElement.pricePerEffect,
			data: result,
		};
	}

	const effectData = (effect: POPIEffect) =>
		computed(() => calculateEffect(effect));

	return {
		calculateEffect,
		effectData,
	};
}
