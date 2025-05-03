import { PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";

export namespace PlanResult {

    type WORKFORCE_TYPE = "pioneer" | "settler" | "technician" | "engineer" | "scientist";

    interface WorkforceElement {
        required: number;
        capacity: number;
        left: number;
        lux1: boolean;
        lux2: boolean;
        efficiency: number;
    }

    interface Result {
        bonus: {
            corphq: boolean;
            cogc: PLAN_COGCPROGRAM_TYPE;
        },
        workforce: Required<Record<WORKFORCE_TYPE, WorkforceElement>>
    }

}