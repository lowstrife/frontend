import {
	ICX,
	IPlan,
	IPlanEmpireElement,
	IPlanShare,
} from "@/stores/planningStore.types";
import { IPlanet } from "@/features/api/gameData.types";
import { StepConfig } from "@/features/wrapper/dataLoader.types";
import { IShared } from "@/features/api/sharingData.types";

export type PlanningDataLoaderProps = {
	readonly empireList?: boolean | undefined;
	readonly sharedPlanUuid?: string | undefined;
	readonly planetNaturalId?: string | undefined;
	readonly planUuid?: string | undefined;
	readonly loadCX?: boolean | undefined;
	readonly loadShared?: boolean | undefined;
};

export type PlanningDataLoaderEmits = {
	(e: "complete"): void;
	(e: "data:shared:plan", data: IPlanShare): void;
	(e: "data:empire:list", data: IPlanEmpireElement[]): void;
	(e: "data:planet", data: IPlanet): void;
	(e: "data:plan", data: IPlan): void;
	(e: "data:cx", data: ICX[]): void;
	(e: "data:shared", data: IShared[]): void;
};

export type PlanningStepConfigsType = [
	StepConfig<IPlanShare>,
	StepConfig<IPlanEmpireElement[]>,
	StepConfig<IPlan>,
	StepConfig<IPlanet>,
	StepConfig<ICX[]>,
	StepConfig<IShared[]>,
];
