import { computed, reactive, ref, Ref, watch, watchEffect } from "vue";

// Stores & Repository
import { queryRepository } from "@/lib/query_cache/queryRepository";
import { useQueryStore } from "@/lib/query_cache/queryStore";

// Composables
import { usePlan } from "@/features/planning_data/usePlan";

// Types & Interfaces
import {
	PlanningDataLoaderEmits,
	PlanningDataLoaderProps,
	PlanningStepConfigsType,
} from "@/features/wrapper/planningDataLoader.types";
import { StepState } from "@/features/wrapper/dataLoader.types";
import {
	ICX,
	IPlan,
	IPlanEmpireElement,
	IPlanShare,
} from "@/stores/planningStore.types";
import { IPlanet } from "@/features/api/gameData.types";
import { IShared } from "@/features/api/sharingData.types";

export function usePlanningDataLoader(
	props: PlanningDataLoaderProps,
	emits: PlanningDataLoaderEmits
) {
	/*
		Validate props for proper use of the component:
		It can either load a shared plan uuid and the related planet by passing
		the sharedPlan uuid or other elements like empires, a plan or planet.
		Loading both is not permitted as it doesn't make sense.
	*/

	if (
		props.sharedPlanUuid &&
		(props.empireList || props.planUuid || props.planetNaturalId)
	) {
		throw new Error(
			"PlanningDataLoader: Loading shared plan must not load any other planning data."
		);
	}

	const queryStore = useQueryStore();
	const done: Ref<boolean> = ref(false);

	const { createBlankDefinition } = usePlan();

	const stepConfigs: PlanningStepConfigsType = [
		{
			key: "sharedPlan",
			name: "Shared Plan Configuration",
			enabled: () => !!props.sharedPlanUuid,
			load: () =>
				queryStore.executeQuery(queryRepository.GetSharedPlan, {
					sharedPlanUuid: props.sharedPlanUuid!,
				}),
			onSuccess: (d: IPlanShare) => emits("data:shared:plan", d),
		},
		{
			key: "empireList",
			name: "Empires Configurations",
			enabled: () => !!props.empireList,
			load: () =>
				queryStore.executeQuery(
					queryRepository.GetAllEmpires,
					undefined
				),
			onSuccess: (d: IPlanEmpireElement[]) =>
				emits("data:empire:list", d),
		},
		{
			key: "plan",
			name: "Plan Configuration",
			enabled: () => !!props.planUuid,
			load: () =>
				queryStore.executeQuery(queryRepository.GetPlan, {
					planUuid: props.planUuid!,
				}),
			onSuccess: (d: IPlan) => emits("data:plan", d),
		},
		{
			key: "planet",
			name: "Planet Data",
			// If sharedPlanId, wait for sharedPlan; else if planetId, no depends; else never
			dependsOn: props.sharedPlanUuid ? "sharedPlan" : undefined,
			enabled: () => !!(props.sharedPlanUuid || props.planetNaturalId),
			load: () => {
				const id = props.sharedPlanUuid
					? (
							queryStore.peekQueryState(
								queryRepository.GetSharedPlan.key({
									sharedPlanUuid: props.sharedPlanUuid!,
								})
							)!.data as IPlanShare
						).baseplanner.planet_id
					: props.planetNaturalId!;
				return queryStore.executeQuery(queryRepository.GetPlanet, {
					planetNaturalId: id,
				});
			},
			onSuccess: (d: IPlanet) => emits("data:planet", d),
		},
		{
			key: "cx",
			name: "CX Configurations",
			enabled: () => !!props.loadCX,
			load: () =>
				queryStore.executeQuery(queryRepository.GetAllCX, undefined),
			onSuccess: (d: ICX[]) => emits("data:cx", d),
		},
		{
			key: "sharedList",
			name: "Shared Plan Configurations",
			enabled: () => !!props.loadCX,
			load: () =>
				queryStore.executeQuery(
					queryRepository.GetAllShared,
					undefined
				),
			onSuccess: (d: IShared[]) => emits("data:shared", d),
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const steps = reactive<StepState<any>[]>(
		stepConfigs.map((cfg) => ({
			cfg,
			data: null,
			loading: false,
			error: null,
			triggered: false,
		}))
	);

	// Orchestrator
	watchEffect(() => {
		steps.forEach((s) => {
			if (!s.triggered && s.cfg.enabled()) {
				const dep = s.cfg.dependsOn
					? steps.find((p) => p.cfg.key === s.cfg.dependsOn)
					: null;
				if (!dep || dep.data != null) {
					s.triggered = true;
					s.loading = true;
					s.error = null;
					s.cfg
						.load()
						.then((d) => {
							s.data = d;
							s.cfg.onSuccess(d);
						})
						.catch((e) => {
							s.error =
								e instanceof Error ? e : new Error(String(e));
						})
						.finally(() => {
							s.loading = false;
						});
				}
			}
		});
	});

	const loadingSteps = computed(() =>
		steps
			.filter((s) => s.cfg.enabled())
			.map((s) => ({
				name: s.cfg.name,
				loading: s.loading,
				error: s.error,
			}))
	);

	const hasError = computed(() =>
		loadingSteps.value.some((l) => l.error != null)
	);

	const allLoaded = computed(() =>
		steps
			.filter((s) => s.cfg.enabled())
			.every((s) => !s.loading && s.error == null && s.data != null)
	);

	watch(
		allLoaded,
		(ok) => {
			if (ok) {
				emits("complete");
				done.value = true;
			}
		},
		{ immediate: true }
	);

	const results = computed(() => {
		const data = {
			sharedPlan: steps.find((s) => s.cfg.key === "sharedPlan")
				?.data as IPlanShare,
			empireList: steps.find((s) => s.cfg.key === "empireList")
				?.data as IPlanEmpireElement[],
			planetData: steps.find((s) => s.cfg.key === "planet")
				?.data as IPlanet,
			planData: steps.find((s) => s.cfg.key === "plan")?.data as IPlan,
			sharedData: steps.find((s) => s.cfg.key === "sharedList")
				?.data as IShared[],
		};

		const planDefinition = props.sharedPlanUuid
			? data.sharedPlan.baseplanner
			: props.planUuid
				? data.planData
				: createBlankDefinition(
						data.planetData.PlanetNaturalId,
						data.planetData.COGCProgramActive
					);

		const disabled: boolean = props.sharedPlanUuid ? true : false;

		return { ...data, planDefinition, disabled };
	});

	return {
		done,
		allLoaded,
		hasError,
		loadingSteps,
		results,
	};
}
