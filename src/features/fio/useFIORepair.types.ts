export interface IFIOSitesRepairTablePlanetElement {
	planetId: string;
	planetName: string;
	amountBuildings: number;
	amountProductionBuildings: number;
	amountInfrastructureBuildings: number;
	minCondition: number;
	averageCondition: number;
	maxLastRepairDays: number;
}

export interface IFIOSitesRepairTableShipElement {
	shipRegistration: string;
	shipName: string;
	condition: number;
	repairMaterials: {
		ticker: string;
		amount: number;
	}[];
}
