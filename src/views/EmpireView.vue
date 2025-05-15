<script setup lang="ts">
	import {
		computed,
		ComputedRef,
		defineAsyncComponent,
		ref,
		Ref,
		toRef,
	} from "vue";

	// Unhead
	import { useHead } from "@unhead/vue";
	useHead({
		title: "Empire | PRUNplanner",
	});

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";
	const planningStore = usePlanningStore();

	// Composables
	import { usePlanCalculation } from "@/features/planning/usePlanCalculation";
	import { useMaterialIOUtil } from "@/features/planning/util/materialIO.util";
	const { combineEmpireMaterialIO } = useMaterialIOUtil();

	// Components
	import RenderingProgress from "@/layout/components/RenderingProgress.vue";
	import EmpireDataWrapper from "@/features/empire/components/EmpireDataWrapper.vue";

	const AsyncGameDataWrapper = defineAsyncComponent(
		() => import("@/features/game_data/components/GameDataWrapper.vue")
	);
	const AsyncEmpirePlanList = defineAsyncComponent(
		() => import("@/features/empire/components/EmpirePlanList.vue")
	);
	const AsyncEmpireMaterialIO = defineAsyncComponent(
		() => import("@/features/empire/components/EmpireMaterialIO.vue")
	);
	const AsyncEmpireConfiguration = defineAsyncComponent(
		() => import("@/features/empire/components/EmpireConfiguration.vue")
	);

	// Types & Interfaces
	import { IPlan, IPlanEmpireElement } from "@/stores/planningStore.types";
	import { IPlanResult } from "@/features/planning/usePlanCalculation.types";
	import {
		IEmpireCostOverview,
		IEmpirePlanListData,
		IEmpirePlanMaterialIO,
	} from "@/features/empire/empire.types";

	// Util
	import { formatNumber } from "@/util/numbers";

	// UI
	import { NForm, NFormItem, NSelect } from "naive-ui";

	const props = defineProps({
		empireUuid: {
			type: String,
			required: false,
		},
	});

	const selectedEmpireUuid: Ref<string | undefined> = ref(props.empireUuid);
	const selectedCXUuid: Ref<string | undefined> = ref(undefined);
	const empireList: Ref<IPlanEmpireElement[]> = ref([]);

	const calculatedPlans: Ref<Record<string, IPlanResult>> = ref({});
	const isCalculating: Ref<boolean> = ref(false);
	const planData: Ref<IPlan[]> = ref([]);

	/**
	 * Calculates all given plans
	 * @author jplacht
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async function calculateEmpire(): Promise<void> {
		isCalculating.value = true;
		// reset calculations
		calculatedPlans.value = {};

		// calculate all plans, pass in references as the
		// empire might be updated
		planData.value.forEach((plan) => {
			calculatedPlans.value[plan.uuid!] = usePlanCalculation(
				toRef(plan),
				selectedEmpireUuid,
				empireList,
				selectedCXUuid
			).result.value;
		});

		isCalculating.value = false;
	}

	/**
	 * Reloads empires forcefully by triggering store reload
	 * @author jplacht
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async function reloadEmpires(): Promise<void> {
		try {
			// make a forced call to also update store
			empireList.value = await planningStore.getAllEmpires(true);
		} catch (err) {
			console.error("Error reloading empires", err);
		}
	}

	/**
	 * Holds computed empire data for the currently selected empire.
	 * @author jplacht
	 *
	 * @type {ComputedRef<IPlanEmpireElement | undefined>} Empire Data
	 */
	const selectedEmpire: ComputedRef<IPlanEmpireElement | undefined> = computed(
		() => {
			return empireList.value.find((e) => e.uuid == selectedEmpireUuid.value);
		}
	);

	/**
	 * Holds computed cost overview based on plan results.
	 * @author jplacht
	 *
	 * @type {ComputedRef<IEmpireCostOverview>} Empire Cost overview
	 */
	const costOverview: ComputedRef<IEmpireCostOverview> = computed(() => {
		const totalProfit: number = Object.values(calculatedPlans.value).reduce(
			(sum, element) => sum + element.profit,
			0
		);
		const totalRevenue: number = Object.values(calculatedPlans.value).reduce(
			(sum, element) => sum + element.revenue,
			0
		);
		const totalCost: number = Object.values(calculatedPlans.value).reduce(
			(sum, element) => sum + element.cost,
			0
		);

		return {
			totalProfit,
			totalRevenue,
			totalCost,
		};
	});

	/**
	 * Holds computed empire name.
	 * @author jplacht
	 *
	 * @type {ComputedRef<string>} Empire Cost overview
	 */
	const empireName: ComputedRef<string> = computed(() => {
		if (selectedEmpire.value) {
			return selectedEmpire.value.name;
		}
		return "Unknown";
	});

	/**
	 * Holds computed empire plan data basic data.
	 * @author jplacht
	 *
	 * @type {ComputedRef<IEmpirePlanListData[]>} Plan List Data
	 */
	const planListData: ComputedRef<IEmpirePlanListData[]> = computed(() => {
		return Object.entries(calculatedPlans.value).map(
			([planUuid, planResult]) => {
				const plan: IPlan = planData.value.find((p) => p.uuid == planUuid)!;

				return {
					uuid: planUuid,
					name: plan.name,
					planet: plan.baseplanner_data.planet.planetid,
					permits: plan.baseplanner_data.planet.permits,
					cogc: plan!.baseplanner_data.planet.cogc,
					profit: planResult.profit,
				};
			}
		);
	});

	/**
	 * Holds computed material i/o per plan with additional information.
	 * @author jplacht
	 *
	 * @type {ComputedRef<IEmpirePlanMaterialIO[]>} Empire Material IO Data
	 */
	const empireMaterialIO: ComputedRef<IEmpirePlanMaterialIO[]> = computed(
		() => {
			return Object.entries(calculatedPlans.value).map(
				([planUuid, planResult]) => {
					const plan: IPlan = planData.value.find((p) => p.uuid == planUuid)!;
					return {
						planetId: plan.baseplanner_data.planet.planetid,
						planUuid: planUuid,
						planName: plan.name ?? "Unknown Plan Name",
						materialIO: planResult.materialio,
					};
				}
			);
		}
	);
</script>

<template>
	<EmpireDataWrapper
		:empire-uuid="selectedEmpireUuid"
		:key="`EMPIREWRAPPER#${selectedEmpireUuid}`"
		v-on:update:empire-uuid="(value: string) => (selectedEmpireUuid = value)"
		v-on:update:plan-list="(value: IPlan[]) => (planData = value)"
		v-on:update:cx-uuid="
			(value: string | undefined) => (selectedCXUuid = value)
		"
		v-on:update:empire-list="
			(value: IPlanEmpireElement[]) => (empireList = value)
		"
	>
		<template #default="{ empireList, planetList }">
			<AsyncGameDataWrapper
				load-materials
				load-exchanges
				load-recipes
				load-buildings
				:load-multiple-planets="planetList"
				:key="`GAMEDATAWRAPPER#${selectedEmpireUuid}`"
				v-on:success="calculateEmpire"
			>
				<template v-if="isCalculating">
					<div>Calculating</div>
				</template>
				<template v-else>
					<div
						class="px-6 py-3 border-b border-white/10 flex flex-row justify-between gap-x-3"
					>
						<h1 class="text-2xl font-bold my-auto">{{ empireName }}</h1>
					</div>
					<div class="grid grid-cols-1 lg:grid-cols-[40%_auto]">
						<div>
							<div
								class="px-6 pb-3 pt-4 lg:border-r border-b border-white/10 my-auto"
							>
								<n-form
									label-placement="left"
									label-width="auto"
									label-align="left"
									size="small"
								>
									<n-form-item label="Switch Empire">
										<n-select
											v-model:value="selectedEmpireUuid"
											:options="
												empireList.map((e) => {
													return { label: e.name, value: e.uuid };
												})
											"
										/>
									</n-form-item>
								</n-form>
							</div>
							<div class="p-6 lg:border-r border-b border-white/10">
								<div
									class="grid grid-cols-1 lg:grid-cols-3 gap-6 child:child:text-center"
								>
									<div>
										<div class="text-white/40 text-xs">Profit</div>
										<div class="text-white text-xl">
											{{ formatNumber(costOverview.totalProfit) }}
										</div>
										<div class="text-white/40 text-xs">
											{{
												formatNumber(
													(costOverview.totalProfit /
														costOverview.totalRevenue) *
														100
												)
											}}
											%
										</div>
									</div>
									<div>
										<div class="text-white/40 text-xs">Revenue</div>
										<div class="text-white text-xl">
											{{ formatNumber(costOverview.totalRevenue) }}
										</div>
									</div>
									<div>
										<div class="text-white/40 text-xs">Cost</div>
										<div class="text-white text-xl">
											{{ formatNumber(costOverview.totalCost) }}
										</div>
										<div class="text-white/40 text-xs">
											{{
												formatNumber(
													(costOverview.totalCost / costOverview.totalRevenue) *
														100
												)
											}}
											%
										</div>
									</div>
								</div>
							</div>
							<div class="p-6 lg:border-r border-b border-white/10">
								<Suspense>
									<AsyncEmpirePlanList :plan-list-data="planListData" />
									<template #fallback>
										<RenderingProgress :height="200" />
									</template>
								</Suspense>
							</div>
							<div class="p-6 lg:border-r border-b border-white/10">
								<Suspense v-if="selectedEmpire">
									<AsyncEmpireConfiguration
										:data="selectedEmpire"
										v-on:reload:empires="reloadEmpires"
									/>
									<template #fallback>
										<RenderingProgress :height="200" />
									</template>
								</Suspense>
							</div>
						</div>
						<div class="p-6">
							<Suspense>
								<AsyncEmpireMaterialIO
									:empire-material-i-o="
										combineEmpireMaterialIO(empireMaterialIO)
									"
								/>
								<template #fallback>
									<RenderingProgress :height="400" />
								</template>
							</Suspense>
						</div>
					</div>
				</template>
			</AsyncGameDataWrapper>
		</template>
	</EmpireDataWrapper>
</template>
