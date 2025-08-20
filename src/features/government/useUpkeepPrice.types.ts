import { POPIEffect } from "@/features/government/government.types";

export interface IGovUpkeepPricePre {
	building: string;
	material: string;
	effect: POPIEffect;
	pricePerEffect: number;
	materialPrice: number;
}

export interface IGovUpkeepPriceElement extends IGovUpkeepPricePre {
	priceRelative: number;
}

export interface IGovUpkeepPrice {
	effect: POPIEffect;
	minBuilding: string;
	minMaterial: string;
	minPricePerEffect: number;
	data: IGovUpkeepPriceElement[];
}
