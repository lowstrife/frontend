import { defineStore } from "pinia";
import { ref, Ref } from "vue";

// API
import { callGetPlan, callGetPlanlist } from "@/features/api/planData.api";
import { callGetSharedList } from "@/features/api/sharingData.api";
import {
	callGetEmpireList,
	callGetEmpirePlans,
} from "@/features/api/empireData.api";
import { callGetCXList } from "@/features/api/cxData.api";

// Util
import { inertClone } from "@/util/data";

// Types & Interfaces
import {
	ICX,
	ICXRecord,
	IEmpireRecord,
	IPlan,
	IPlanEmpireElement,
	IPlanRecord,
	ISharedPlan,
	ISharedRecord,
} from "@/stores/planningStore.types";
import { IShared } from "@/features/api/sharingData.types";

export const usePlanningStore = defineStore(
	"prunplanner_planning",
	() => {
		// state
		/** Key: Plan.uuid */
		const plans: Ref<IPlanRecord> = ref({});
		/** Key: Empire.uuid */
		const empires: Ref<IEmpireRecord> = ref({});
		/** Key: CX.uuid */
		const cxs: Ref<ICXRecord> = ref({});
		/** Key: Plan.uuid */
		const shared: Ref<ISharedRecord> = ref({});

		// state reset
		function $reset(): void {
			plans.value = {};
			empires.value = {};
			cxs.value = {};
			shared.value = {};
		}

		// computed getters

		/**
		 * Get CX Preference information by CX Uuid
		 * @author jplacht
		 *
		 * @param {string} cxUuid UUid
		 * @returns {ICX} CX Preference Data
		 */
		function getCX(cxUuid: string): ICX {
			const findCX = cxs.value[cxUuid];

			if (findCX) return findCX;

			throw new Error(
				`No data: CX '${cxUuid}'. Ensure CX uuid is valid and planning data has been loaded.`
			);
		}

		// functions

		/**
		 * Fetches a plan from store or backend depending if it was
		 * already fetched previously.
		 *
		 * @author jplacht
		 *
		 * @async
		 * @param {string} planUuid Uuid
		 * @returns {Promise<IPlan>} Plan Data
		 */
		async function getPlan(planUuid: string): Promise<IPlan> {
			// try getting from already fetched data first
			const findPlan: IPlan | undefined = plans.value[planUuid];

			if (findPlan) return inertClone(plans.value[planUuid]);

			// load from backend
			try {
				const fetchedPlan: IPlan = await callGetPlan(planUuid);

				plans.value[planUuid] = fetchedPlan;
				return inertClone(plans.value[planUuid]);
			} catch (error) {
				// print and also throw error
				console.error(error);
				throw error;
			}
		}

		/**
		 * Fetches all plans from the backend, stores them in this store
		 * and then returns them as list
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<IPlan[]>} Plan Data List
		 */
		async function getAllPlans(): Promise<IPlan[]> {
			try {
				plans.value = {};
				const fetchedPlans: IPlan[] = await callGetPlanlist();

				fetchedPlans.forEach((plan) => {
					plans.value[plan.uuid!] = plan;
				});

				return inertClone(Object.values(plans.value));
			} catch (error) {
				console.error(error);
				throw error;
			}
		}

		/**
		 * Gets all empires the user has either from previous fetch
		 * or will load it again from the backend API
		 * @author jplacht
		 *
		 * @async
		 * @param {boolean} [force=false] Force Load from backend
		 * @returns {Promise<IPlanEmpireElement[]>} Empire List
		 */
		async function getAllEmpires(
			force: boolean = false
		): Promise<IPlanEmpireElement[]> {
			// try getting from already fetched first, if not forced
			if (!force && Object.keys(empires.value).length > 0) {
				return inertClone(Object.values(empires.value));
			}

			// load from backend
			try {
				const fetchedEmpireList: IPlanEmpireElement[] =
					await callGetEmpireList();

				// initially reset empires
				empires.value = {};

				// store by Empire.uuid
				fetchedEmpireList.forEach((e) => {
					empires.value[e.uuid] = e;
				});

				return inertClone(Object.values(empires.value));
			} catch (error) {
				console.error(error);
				throw error;
			}
		}

		/**
		 * Gets all plans for given empire either from already stored data
		 * or fetching missing ones from the backend api
		 * @author jplacht
		 *
		 * @async
		 * @param {string} empireUuid Empire Uuid
		 * @param {string[]} [planUuids=[]] Array of Plan Uuids to fetch
		 * @returns {Promise<IPlan[]>} Array of Plan Data
		 */
		async function getOrLoadEmpirePlans(
			empireUuid: string,
			planUuids: string[] = []
		): Promise<IPlan[]> {
			// if there is a an array of planUuids, check for existance of all plans
			if (planUuids.length > 0) {
				const plansInStore: string[] = Object.keys(plans.value);

				let checker: boolean = planUuids.every((p) =>
					plansInStore.includes(p)
				);
				if (checker) {
					// all plans existing, return them
					const planList: IPlan[] = [];
					planUuids.map(async (uuid) => {
						planList.push(await getPlan(uuid));
					});

					return planList;
				}
			}

			// call endpoint to retrieve all plans for this empire
			const loadedPlans: IPlan[] = await callGetEmpirePlans(empireUuid);

			// store
			loadedPlans.forEach((empirePlan) => {
				plans.value[empirePlan.uuid!] = empirePlan;
			});

			// return all from store
			const loadedPlanList: IPlan[] = [];
			loadedPlans
				.map((e) => e.uuid)
				.forEach(async (planUuid) => {
					if (planUuid) {
						loadedPlanList.push(await getPlan(planUuid));
					}
				});

			return loadedPlanList;
		}

		/**
		 * Gets all exchange preferences either from store or directly from
		 * the backend API if they were not fetched already
		 *
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<ICX[]>} CX Preference Data Array
		 */
		async function getAllCX(force: boolean = false): Promise<ICX[]> {
			// try getting from already fetched cx data first, if not forced
			if (!force && Object.keys(cxs.value).length > 0) {
				return inertClone(Object.values(cxs.value));
			}

			// load from backend
			try {
				const fetchedCXList: ICX[] = await callGetCXList();

				// reset existing cx data
				cxs.value = {};

				// store by CX.uuid
				fetchedCXList.forEach((c) => {
					cxs.value[c.uuid] = c;
				});

				return inertClone(Object.values(cxs.value));
			} catch (error) {
				throw error;
			}
		}

		/**
		 * Gets all sharing information from backend
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<ISharedPlan[]>} Sharing Information List
		 */
		async function getSharedList(): Promise<ISharedPlan[]> {
			try {
				const fetchedShared: IShared[] = await callGetSharedList();

				// reset existing shared data
				shared.value = {};

				// store by Plan.uuid
				fetchedShared.forEach((s) => {
					shared.value[s.plan_uuid] = s;
				});

				return inertClone(Object.values(shared.value));
			} catch (error) {
				throw error;
			}
		}

		/**
		 * Resets plans
		 * @author jplacht
		 */
		function resetPlans(): void {
			plans.value = {};
		}

		/**
		 * Resets empires
		 * @author jplacht
		 */
		function resetEmpires(): void {
			empires.value = {};
		}

		/**
		 * Resets exchange preferences
		 * @author jplacht
		 */
		function resetCXS(): void {
			cxs.value = {};
		}

		/**
		 * Resets shared plans
		 * @author jplacht
		 */
		function resetShared(): void {
			shared.value = {};
		}

		return {
			// state
			plans,
			empires,
			cxs,
			shared,
			// reset
			$reset,
			// computed getters
			// getters
			getCX,
			// functions
			getPlan,
			getAllEmpires,
			getAllCX,
			getOrLoadEmpirePlans,
			getAllPlans,
			getSharedList,
			// resetter
			resetPlans,
			resetEmpires,
			resetCXS,
			resetShared,
		};
	},
	{
		persist: {
			pick: ["plans", "empires", "cxs", "shared"],
		},
	}
);
