import {
	PLAN_COGCPROGRAM_TYPE,
	PLAN_FACTION,
} from "@/stores/planningStore.types";
import { IMaterialIO } from "@/features/planning/usePlanCalculation.types";

interface IEmpirePlanListData {
	uuid: string;
	name: string | undefined;
	planet: string;
	permits: number;
	cogc: PLAN_COGCPROGRAM_TYPE;
	profit: number;
}

interface IEmpireMaterialIOPlanet {
	planetId: string;
	planUuid: string;
	planName: string;
	value: number;
	price: number;
}

interface IEmpireMaterialIO {
	ticker: string;
	input: number;
	output: number;
	delta: number;
	deltaPrice: number;
	inputPlanets: IEmpireMaterialIOPlanet[];
	outputPlanets: IEmpireMaterialIOPlanet[];
}

interface IEmpirePlanMaterialIO {
	planetId: string;
	planUuid: string;
	planName: string;
	materialIO: IMaterialIO[];
}

interface IEmpirePatchPayload {
	faction: PLAN_FACTION;
	permits_used: number;
	permits_total: number;
	name: string;
	use_fio_storage: boolean;
}

interface IEmpireCreatePayload extends IEmpirePatchPayload {}

interface IEmpireCostOverview {
	totalProfit: number;
	totalRevenue: number;
	totalCost: number;
}
