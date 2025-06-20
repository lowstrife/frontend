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
	import { usePlanCalculation } from "@/features/planning/usePlanCalculation";
	import { usePreferences } from "@/features/preferences/usePreferences";
	const { defaultEmpireUuid, burnDaysRed, burnDaysYellow } = usePreferences();
	import { useFIOBurn } from "@/features/fio/useFIOBurn";
	import { usePlanetData } from "@/features/game_data/usePlanetData";
	const { getPlanetName } = usePlanetData();

	// Components
	import EmpireDataWrapper from "@/features/wrapper/components/EmpireDataWrapper.vue";
	import HelpDrawer from "@/features/help/components/HelpDrawer.vue";
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";
	const AsyncGameDataWrapper = defineAsyncComponent(
		() => import("@/features/wrapper/components/GameDataWrapper.vue")
	);

	// Util
	import { relativeFromDate } from "@/util/date";
	import { formatNumber, formatAmount } from "@/util/numbers";

	// Types & Interfaces
	import { IPlan, IPlanEmpireElement } from "@/stores/planningStore.types";
	import { IPlanResult } from "@/features/planning/usePlanCalculation.types";

	// UI
	import { NSelect, NForm, NFormItem, NInputNumber } from "naive-ui";
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";

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

	const burnTable = computed(() => {
		return useFIOBurn(refPlanData, refCalculatedPlans).burnTable;
	});

	const planTable = computed(() => {
		return useFIOBurn(refPlanData, refCalculatedPlans).planTable;
	});

	function getBurnDisplayClass(value: number): ComputedRef<string> {
		return computed(() => {
			if (value <= burnDaysRed.value) {
				return "text-white bg-negative";
			} else if (value <= burnDaysYellow.value)
				return "text-black bg-yellow-300";
			else return "";
		});
	}
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
								Overview
							</h2>

							<XNDataTable :data="planTable.value" striped>
								<XNDataTableColumn
									key="planUuid"
									title="Plan"
									sorter="default">
									<template #render-cell="{ rowData }">
										<router-link
											:to="`/plan/${rowData.planetId}/${rowData.planUuid}`"
											class="text-link-primary font-bold hover:underline">
											{{ rowData.planName }}
										</router-link>
									</template>
								</XNDataTableColumn>
								<XNDataTableColumn
									key="planetId"
									title="Planet">
									<template #render-cell="{ rowData }">
										{{ getPlanetName(rowData.planetId) }}
									</template>
								</XNDataTableColumn>
								<XNDataTableColumn
									key="minDays"
									title="Exhaustion"
									sorter="default">
									<template #render-cell="{ rowData }">
										<div class="text-center">
											<span
												:class="
													getBurnDisplayClass(
														rowData.minDays
													).value
												"
												class="py-1 px-2">
												{{
													formatNumber(
														rowData.minDays
													)
												}}
											</span>
										</div>
									</template>
								</XNDataTableColumn>
							</XNDataTable>
						</div>
						<div>
							<XNDataTable :data="burnTable.value" striped>
								<XNDataTableColumn title="" type="expand">
									<template #render-cell="{ rowData }">
										{{ rowData.planName }}
									</template>
									<template #render-expand="{ rowData }">
										<XNDataTable
											:data="rowData.burnMaterials"
											striped>
											<XNDataTableColumn
												key="ticker"
												title="Ticker"
												sorter="default">
												<template #render-cell="data">
													<MaterialTile
														:ticker="
															data.rowData.ticker
														" />
												</template>
											</XNDataTableColumn>
											<XNDataTableColumn
												key="input"
												title="Consumption"
												sorter="default">
												<template #render-cell="data">
													<span
														:class="
															data.rowData
																.input <= 0
																? 'text-white/50'
																: ''
														">
														{{
															formatNumber(
																data.rowData
																	.input
															)
														}}
													</span>
												</template>
											</XNDataTableColumn>
											<XNDataTableColumn
												key="output"
												title="Production"
												sorter="default">
												<template #render-cell="data">
													<span
														:class="
															data.rowData
																.output <= 0
																? 'text-white/50'
																: ''
														">
														{{
															formatNumber(
																data.rowData
																	.output
															)
														}}
													</span>
												</template>
											</XNDataTableColumn>
											<XNDataTableColumn
												key="delta"
												title="Delta"
												sorter="default">
												<template #render-cell="data">
													<span
														:class="
															data.rowData
																.delta >= 0
																? 'text-positive'
																: 'text-negative'
														">
														{{
															formatNumber(
																data.rowData
																	.delta
															)
														}}
													</span>
												</template>
											</XNDataTableColumn>
											<XNDataTableColumn
												key="stock"
												title="Stock"
												sorter="default">
												<template #render-cell="data">
													{{
														formatAmount(
															data.rowData.stock
														)
													}}
												</template>
											</XNDataTableColumn>
											<XNDataTableColumn
												key="exhaustion"
												title="Exhaustion"
												sorter="default">
												<template #render-cell="data">
													<span
														:class="
															getBurnDisplayClass(
																data.rowData
																	.exhaustion
															).value
														"
														class="py-1 px-2">
														{{
															formatNumber(
																data.rowData
																	.exhaustion
															)
														}}
													</span>
												</template>
											</XNDataTableColumn>
										</XNDataTable>
									</template>
								</XNDataTableColumn>
								<XNDataTableColumn key="planName" title="Plan">
									<template #title>
										<div
											class="flex flex-row justify-between">
											<div>Plan</div>
											<div>Exhaustion</div>
										</div>
									</template>
									<template #render-cell="{ rowData }">
										<div
											class="flex flex-row justify-between">
											<div>
												<span class="font-bold">
													{{ rowData.planName }}
												</span>
												<span class="!text-white/50">
													&mdash;
													{{
														getPlanetName(
															rowData.planetId
														)
													}}
												</span>
											</div>
											<div>
												<span
													class="py-1 px-2"
													:class="
														getBurnDisplayClass(
															rowData.minDays
														).value
													">
													{{
														formatNumber(
															rowData.minDays
														)
													}}
												</span>
											</div>
										</div>
									</template>
								</XNDataTableColumn>
							</XNDataTable>
						</div>
					</div>
				</div>
			</AsyncGameDataWrapper>
		</template>
	</EmpireDataWrapper>
</template>
