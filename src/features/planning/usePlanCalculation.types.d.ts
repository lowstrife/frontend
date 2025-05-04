import { PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";

export namespace PlanResult {
	type WORKFORCE_TYPE =
		| "pioneer"
		| "settler"
		| "technician"
		| "engineer"
		| "scientist";

	type INFRASTRUCTURE_TYPE =
		| "HB1"
		| "HB2"
		| "HB3"
		| "HB4"
		| "HB5"
		| "HBB"
		| "HBC"
		| "HBM"
		| "HBL"
		| "STO";

	type EXPERT_TYPE =
		| "Agriculture"
		| "Chemistry"
		| "Construction"
		| "Electronics"
		| "Food_Industries"
		| "Fuel_Refining"
		| "Manufacturing"
		| "Metallurgy"
		| "Resource_Extraction";

	interface WorkforceElement {
		name: WORKFORCE_TYPE;
		required: number;
		capacity: number;
		left: number;
		lux1: boolean;
		lux2: boolean;
		efficiency: number;
	}

	interface AreaResult {
		permits: number;
		areaUsed: number;
		areaTotal: number;
		areaLeft: number;
	}

	interface ExpertElement {
		name: EXPERT_TYPE;
		amount: number;
		bonus: number;
	}

	interface WorkforceRecord
		extends Required<Record<WORKFORCE_TYPE, WorkforceElement>> {}

	interface InfrastructureRecord
		extends Required<Record<INFRASTRUCTURE_TYPE, number>> {}

	interface ExpertRecord extends Required<Record<EXPERT_TYPE, ExpertElement>> {}

	interface Result {
		bonus: {
			corphq: boolean;
			cogc: PLAN_COGCPROGRAM_TYPE;
		};
		workforce: WorkforceRecord;
		area: AreaResult;
		infrastructure: InfrastructureRecord;
		experts: ExpertRecord;
	}
}
