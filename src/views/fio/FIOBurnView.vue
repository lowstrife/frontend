<script setup lang="ts">
	import {
		computed,
		ComputedRef,
		defineAsyncComponent,
		Ref,
		ref,
		toRef,
	} from "vue";

	// Unhead
	import { useHead } from "@unhead/vue";
	useHead({
		title: "Burn | PRUNplanner",
	});

	// Stores
	import { useGameDataStore } from "@/stores/gameDataStore";

	// Composables
	import { useFIOBurn } from "@/features/fio/useFIOBurn";
	import { usePlanCalculation } from "@/features/planning/usePlanCalculation";
	import { usePreferences } from "@/features/preferences/usePreferences";
	const { defaultEmpireUuid, burnDaysRed, burnDaysYellow } = usePreferences();

	// Components
	import EmpireDataWrapper from "@/features/wrapper/components/EmpireDataWrapper.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";

	const AsyncGameDataWrapper = defineAsyncComponent(
		() => import("@/features/wrapper/components/GameDataWrapper.vue")
	);
	const AsyncFIOBurnPlanTable = defineAsyncComponent(
		() => import("@/features/fio/components/FIOBurnPlanTable.vue")
	);
	const AsyncFIOBurnTable = defineAsyncComponent(
		() => import("@/features/fio/components/FIOBurnTable.vue")
	);

	// Util
	import { relativeFromDate } from "@/util/date";

	// Types & Interfaces
	import { IPlan, IPlanEmpireElement } from "@/stores/planningStore.types";
	import { IPlanResult } from "@/features/planning/usePlanCalculation.types";

	// UI
	import { NSelect, NForm, NFormItem, NInputNumber } from "naive-ui";
	import {
		IFIOBurnPlanetTableElement,
		IFIOBurnTableElement,
	} from "@/features/fio/useFIOBurn.types";

	const gameDataStore = useGameDataStore();

	const refIsCalculating: Ref<boolean> = ref(false);
	const refSelectedEmpireUuid: Ref<string | undefined> =
		ref(defaultEmpireUuid);
	const refSelectedCXUuid: Ref<string | undefined> = ref(undefined);
	const refPlanData: Ref<IPlan[]> = ref([]);
	const refEmpireList: Ref<IPlanEmpireElement[]> = ref([]);
	const refCalculatedPlans: Ref<Record<string, IPlanResult>> = ref({});

	function calculateEmpire(): void {
		refIsCalculating.value = true;

		refCalculatedPlans.value = {};

		// calculate all plans, pass in references as the
		// empire might be updated
		refPlanData.value.forEach((plan) => {
			refCalculatedPlans.value[plan.uuid!] = usePlanCalculation(
				toRef(plan),
				refSelectedEmpireUuid,
				refEmpireList,
				refSelectedCXUuid
			).result.value;
		});

		refIsCalculating.value = false;
	}

	const burnTable: ComputedRef<IFIOBurnTableElement[]> = computed(() => {
		return useFIOBurn(refPlanData, refCalculatedPlans).burnTable.value;
	});

	const planTable: ComputedRef<IFIOBurnPlanetTableElement[]> = computed(
		() => {
			return useFIOBurn(refPlanData, refCalculatedPlans).planTable.value;
		}
	);
</script>

<template>
	<EmpireDataWrapper
		:key="`EMPIREWRAPPER#${refSelectedEmpireUuid}`"
		:empire-uuid="refSelectedEmpireUuid"
		@update:empire-uuid="(value: string) => (refSelectedEmpireUuid = value)"
		@update:plan-list="(value: IPlan[]) => (refPlanData = value)"
		@update:cx-uuid="
			(value: string | undefined) => (refSelectedCXUuid = value)
		"
		@update:empire-list="
			(value: IPlanEmpireElement[]) => (refEmpireList = value)
		">
		<template #default="{ planetList }">
			<AsyncGameDataWrapper
				:key="`GAMEDATAWRAPPER#${refSelectedEmpireUuid}`"
				load-materials
				load-exchanges
				load-recipes
				load-buildings
				:load-multiple-planets="planetList"
				@success="calculateEmpire">
				<div class="min-h-screen flex flex-col">
					<div
						class="px-6 py-3 border-b border-white/10 flex flex-row justify-between">
						<h1 class="text-2xl font-bold my-auto">FIO Burn</h1>
						<div class="flex flex-row gap-x-3">
							<div class="my-auto">
								Last Storage Data Refresh from Backend:
								<strong>
									{{
										relativeFromDate(
											gameDataStore.lastRefreshedFIOStorage
										)
									}}
								</strong>
							</div>
							<HelpDrawer file-name="fio_burn" />
						</div>
					</div>

					<div
						class="flex-grow grid grid-cols-1 lg:grid-cols-[30%_auto] gap-3 divide-x divide-white/10 child:px-6 child:py-3">
						<div>
							<h2 class="text-white/80 font-bold text-lg pb-3">
								Empire
							</h2>

							<n-select
								v-model:value="refSelectedEmpireUuid"
								:options="
									refEmpireList.map((e) => {
										return {
											label: e.name,
											value: e.uuid,
										};
									})
								"
								size="small"
								@update-value="
									(value: string) => {
										refSelectedEmpireUuid = value;
										defaultEmpireUuid = value;
									}
								" />

							<h2 class="text-white/80 font-bold text-lg py-3">
								Burn Thresholds
							</h2>

							<n-form
								label-placement="left"
								label-width="auto"
								label-align="left"
								size="small">
								<n-form-item label="Red Threshold">
									<n-input-number
										v-model:value="burnDaysRed"
										show-button
										:min="1"
										class="w-full" />
								</n-form-item>
								<n-form-item label="Yellow Threshold">
									<n-input-number
										v-model:value="burnDaysYellow"
										show-button
										:min="1"
										class="w-full" />
								</n-form-item>
							</n-form>

							<h2 class="text-white/80 font-bold text-lg py-3">
								Plan Burn Overview
							</h2>

							<AsyncFIOBurnPlanTable :plan-table="planTable" />
						</div>
						<div>
							<AsyncFIOBurnTable :burn-table="burnTable" />
						</div>
					</div>
				</div>
			</AsyncGameDataWrapper>
		</template>
	</EmpireDataWrapper>
</template>
