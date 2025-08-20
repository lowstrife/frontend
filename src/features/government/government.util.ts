// Static data
import { popiBuildingMap } from "@/features/government/assets/popiValues";

// Types & Interfaces
import { POPIEffect } from "@/features/government/government.types";
import { IGovUpkeepEffect } from "@/features/government/government.util.types";

export function getUpkeepByEffect(effect: POPIEffect): IGovUpkeepEffect[] {
	const result = [];

	for (const [building, materials] of Object.entries(popiBuildingMap)) {
		for (const [material, data] of Object.entries(materials)) {
			if (data.effects[effect] > 0) {
				result.push({
					building,
					material,
					effect,
					qtyDay: data.qtyPerDay,
					effectValue: data.effects[effect],
				});
			}
		}
	}

	return result;
}
