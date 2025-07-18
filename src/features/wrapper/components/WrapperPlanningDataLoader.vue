<script setup lang="ts">
	import { reactive, watchEffect, computed, watch, Ref, ref } from "vue";
	import { NSpin, NIcon } from "naive-ui";
	import { CheckSharp, ClearSharp } from "@vicons/material";
	import RenderingProgress from "@/layout/components/RenderingProgress.vue";

	import { useQueryStore } from "@/lib/query_cache/queryStore";
	import { queryRepository } from "@/lib/query_cache/queryRepository";

	import type { IPlanet } from "@/features/api/gameData.types";
	import {
		IPlan,
		IPlanEmpireElement,
		IPlanShare,
	} from "@/stores/planningStore.types";

	// — Props —
	const props = defineProps<{
		sharedPlanId?: string;
		empireList?: boolean;
		planetId?: string;
		planUuid?: string;
	}>();

	const emit = defineEmits<{
		(e: "data:shared:plan", data: IPlanShare): void;
		(e: "data:empire:list", data: IPlanEmpireElement[]): void;
		(e: "data:planet", data: IPlanet): void;
		(e: "data:plan", data: IPlan): void;
		(e: "complete"): void;
	}>();

	const store = useQueryStore();

	interface StepConfig<TData> {
		key: string;
		name: string;
		enabled: () => boolean;
		dependsOn?: string;
		load: () => Promise<TData>;
		onSuccess: (d: TData) => void;
	}

	const stepConfigs: [
		StepConfig<IPlanShare>,
		StepConfig<IPlanEmpireElement[]>,
		StepConfig<IPlan>,
		StepConfig<IPlanet>,
	] = [
		{
			key: "sharedPlan",
			name: "Shared Plan Configuration",
			enabled: () => !!props.sharedPlanId,
			load: () =>
				store.executeQuery(queryRepository.GetSharedPlan, {
					sharedPlanUuid: props.sharedPlanId!,
				}),
			onSuccess: (d: IPlanShare) => emit("data:shared:plan", d),
		},
		{
			key: "empireList",
			name: "Empires Configurations",
			enabled: () => !!props.empireList,
			load: () =>
				store.executeQuery(queryRepository.GetAllEmpires, undefined),
			onSuccess: (d: IPlanEmpireElement[]) => emit("data:empire:list", d),
		},
		{
			key: "plan",
			name: "Plan Configuration",
			enabled: () => !!props.planUuid,
			load: () =>
				store.executeQuery(queryRepository.GetPlan, {
					planUuid: props.planUuid!,
				}),
			onSuccess: (d: IPlan) => emit("data:plan", d),
		},
		{
			key: "planet",
			name: "Planet Data",
			// If sharedPlanId, wait for sharedPlan; else if planetId, no depends; else never
			dependsOn: props.sharedPlanId ? "sharedPlan" : undefined,
			enabled: () => !!(props.sharedPlanId || props.planetId),
			load: () => {
				const id = props.sharedPlanId
					? (
							store.peekQueryState(
								queryRepository.GetSharedPlan.key({
									sharedPlanUuid: props.sharedPlanId!,
								})
							)!.data as IPlanShare
						).baseplanner.planet_id
					: props.planetId!;
				return store.executeQuery(queryRepository.GetPlanet, {
					planetNaturalId: id,
				});
			},
			onSuccess: (d: IPlanet) => emit("data:planet", d),
		},
	];

	// — Reactive state for each step —
	type StepState<TData> = {
		cfg: StepConfig<TData>;
		data: TData | null;
		loading: boolean;
		error: Error | null;
		triggered: boolean;
	};

	const steps = reactive<StepState<any>[]>(
		stepConfigs.map((cfg) => ({
			cfg,
			data: null,
			loading: false,
			error: null,
			triggered: false,
		}))
	);

	// — Central orchestrator —
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

	// — UI state —
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

	const done: Ref<boolean> = ref(false);

	const results = computed(() => {
		return {
			sharedPlan: steps.find((s) => s.cfg.key === "sharedPlan")
				?.data as IPlanShare,
			empireList: steps.find((s) => s.cfg.key === "empireList")
				?.data as IPlanEmpireElement[],
			planetData: steps.find((s) => s.cfg.key === "planet")
				?.data as IPlanet,
			planData: steps.find((s) => s.cfg.key === "plan")?.data as IPlan,
		};
	});

	// emit once
	watch(
		allLoaded,
		(ok) => {
			if (ok) {
				emit("complete");
				done.value = true;
			}
		},
		{ immediate: true }
	);
</script>

<template>
	<template v-if="!done && !allLoaded">
		<div
			class="relative w-full h-full bg-center bg-repeat"
			:class="
				!hasError
					? 'bg-[url(/images/bg_striped_prunplanner.png)]'
					: 'bg-[url(/images/bg_striped_error.png)]'
			">
			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="bg-black p-8 rounded shadow-lg text-center flex flex-col gap-y-3">
					<h1 class="text-2xl font-bold font-mono mb-3">
						Loading Data...
					</h1>
					<div
						v-for="e in loadingSteps"
						:key="e.name"
						class="flex flex-row align-middle gap-x-3">
						<div class="mr-5 w-[30px]">
							<div v-if="e.loading" class="my-1">
								<n-spin :size="14" />
							</div>
							<n-icon v-else :size="20">
								<CheckSharp v-if="!e.error" />
								<ClearSharp v-else />
							</n-icon>
						</div>
						<div>{{ e.name }}</div>
					</div>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<Suspense>
			<slot
				:complete="allLoaded"
				:shared-plan="results.sharedPlan"
				:empire-list="results.empireList"
				:planet-data="results.planetData"
				:plan-data="results.planData" />
			<template #fallback>
				<RenderingProgress />
			</template>
		</Suspense>
	</template>
</template>
