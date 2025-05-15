import { defineStore } from "pinia";
import { ref, Ref, toRaw } from "vue";

// API
import { callGetPlan } from "@/features/planning_data/planData.api";
import {
	callGetEmpireList,
	callGetEmpirePlans,
} from "@/features/empire/empireData.api";
import { callGetCXList } from "@/features/cx/cxData.api";

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
} from "@/stores/planningStore.types";

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
			// try getting from already fetched first
			if (!force && Object.keys(empires.value).length > 0) {
				return toRaw(Object.values(empires.value));
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

				let checker: boolean = planUuids.every((p) => plansInStore.includes(p));
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
		async function getAllCX(): Promise<ICX[]> {
			// try getting from already fetched cx data first
			if (Object.keys(cxs.value).length > 0) {
				return toRaw(Object.values(cxs.value));
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

		return {
			// state
			plans,
			empires,
			cxs,
			// computed getters
			// getters
			getCX,
			// functions
			getPlan,
			getAllEmpires,
			getAllCX,
			getOrLoadEmpirePlans,
		};
	},
	{
		persist: {
			pick: ["plans", "empires", "cxs"],
		},
	}
);
