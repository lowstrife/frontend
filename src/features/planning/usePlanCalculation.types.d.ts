import { PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";

export namespace PlanResult {
	type WORKFORCE_TYPE =
		| "pioneer"
		| "settler"
		| "technician"
		| "engineer"
		| "scientist";

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

	interface WorkforceRecord
		extends Required<Record<WORKFORCE_TYPE, WorkforceElement>> {}

	interface Result {
		bonus: {
			corphq: boolean;
			cogc: PLAN_COGCPROGRAM_TYPE;
		};
		workforce: WorkforceRecord;
		area: AreaResult;
	}
}
