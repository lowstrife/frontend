export interface IFIOFindMaterialLocation {
	type: string;
	name: string;
	amount: number;
}

export interface IFIOFindMaterialResult {
	amount: number;
	locations: IFIOFindMaterialLocation[];
}
