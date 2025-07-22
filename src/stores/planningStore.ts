import { defineStore } from "pinia";
import { ref, Ref } from "vue";

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

		// setters
		function setEmpires(empireList: IPlanEmpireElement[]): void {
			empires.value = {};
			// store by Empire.uuid
			empireList.forEach((e) => {
				empires.value[e.uuid] = e;
			});
		}

		function setPlan(data: IPlan): void {
			if (!data.uuid)
				throw new Error("Can't set plan data for undefined uuid.");

			plans.value[data.uuid] = data;
		}

		function setPlans(data: IPlan[]): void {
			data.forEach((p) => setPlan(p));
		}

		function deletePlan(planUuid: string): void {
			delete plans.value[planUuid];
		}

		function setCXs(data: ICX[]): void {
			cxs.value = {};
			// store by CX.uuid
			data.forEach((c) => {
				cxs.value[c.uuid] = c;
			});
		}

		function setSharedList(data: IShared[]): void {
			shared.value = {};
			data.forEach((s) => {
				shared.value[s.plan_uuid] = s;
			});
		}

		function deleteShared(planUuid: string): void {
			delete shared.value[planUuid];
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

			throw new Error(
				`No data: Plan '${planUuid}'. Ensure Plan uuid is valid and planning data has been loaded.`
			);
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
			return inertClone(Object.values(plans.value));
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
		async function getAllEmpires(): Promise<IPlanEmpireElement[]> {
			return inertClone(Object.values(empires.value));
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
			return inertClone(Object.values(cxs.value));
		}

		/**
		 * Gets all sharing information from backend
		 * @author jplacht
		 *
		 * @async
		 * @returns {Promise<ISharedPlan[]>} Sharing Information List
		 */
		async function getSharedList(): Promise<ISharedPlan[]> {
			return inertClone(Object.values(shared.value));
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
			// setters
			setEmpires,
			setPlan,
			setPlans,
			setCXs,
			setSharedList,
			deleteShared,
			deletePlan,
			// functions
			getPlan,
			getAllEmpires,
			getAllCX,
			getAllPlans,
			getSharedList,
		};
	},
	{
		persist: {
			pick: ["plans", "empires", "cxs", "shared"],
		},
	}
);
