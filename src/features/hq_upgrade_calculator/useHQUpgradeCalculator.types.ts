interface IHQLevelData {
	ticker: string;
	amount: number;
}

export interface IHQMaterialData {
	amount: number;
	override: number;
	required: number;
	unitCost: number;
	totalCost: number;
	storage: number;
	storageLocations: { type: string; name: string; amount: number }[];
}

export interface IHQMaterial extends IHQMaterialData {
	ticker: string;
}

export type IHQLevelRecord = Record<number, IHQLevelData[]>;
