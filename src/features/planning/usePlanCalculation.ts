import { computed, ComputedRef, Ref, toRef } from "vue";

// Types & Interfaces
import { IPlan, IPlanData, IPlanDataPlanet, IPlanDataWorkforce, PLAN_COGCPROGRAM_TYPE } from "@/features/planning/usePlan.types";
import { PlanResult } from "./usePlanCalculation.types";



export function usePlanCalculation(plan: Ref<IPlan>) {

    const data: Ref<IPlanData> = toRef(plan.value.baseplanner_data)
    const planet: Ref<IPlanDataPlanet> = toRef(data.value.planet);

    // helper
    const workforceTypeNames: string[] = ["pioneer" , "settler" , "technician" , "engineer" , "scientist"]

    function calculateWorkforceResult(): Required<Record<PlanResult.WORKFORCE_TYPE, PlanResult.WorkforceElement>> {

        const result: Record<PlanResult.WORKFORCE_TYPE, PlanResult.WorkforceElement> = Object.fromEntries(
            workforceTypeNames.map((key) => {

                // get current workforce value from planet data
                const dataLuxuries: IPlanDataWorkforce | undefined = planet.value.workforce.find((e) => e.type == key);

                return [key, {
                    required: 0,
                    capacity: 0,
                    left: 0,
                    lux1: dataLuxuries ? dataLuxuries.lux1 : true,
                    lux2: dataLuxuries ? dataLuxuries.lux2 : true,
                    efficiency: 0,
                } as PlanResult.WorkforceElement]
            })
        ) as Record<PlanResult.WORKFORCE_TYPE, PlanResult.WorkforceElement>;


        return result;
    }


    // handler

    function handleUpdateCorpHQ(value: boolean): void {
        planet.value.corphq = value;
    }

    function handleUpdateCOGC(value: PLAN_COGCPROGRAM_TYPE): void {
        planet.value.cogc = value;
    }

    


    const result: ComputedRef<PlanResult.Result> = computed(() => {

        return {
            bonus: {
                corphq: planet.value.corphq,
                cogc: planet.value.cogc
            },
            workforce: calculateWorkforceResult(),
        }
    });
    

    return {
        result,
        // handler
        handleUpdateCorpHQ,
        handleUpdateCOGC,
    }
}