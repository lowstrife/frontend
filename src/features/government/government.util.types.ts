import { POPIEffect } from "@/features/government/government.types";

export interface IGovUpkeepEffect {
	building: string;
	material: string;
	effect: POPIEffect;
	qtyDay: number;
	effectValue: number;
}
