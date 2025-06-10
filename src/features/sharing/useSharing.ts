import { computed, ComputedRef } from "vue";

// Stores
import { usePlanningStore } from "@/stores/planningStore";

// Lib
import config from "@/lib/config";

// API
import {
	callCreateSharing,
	callDeleteSharing,
} from "@/features/api/sharingData.api";

export function useSharing(planUuid: string) {
	const planningStore = usePlanningStore();

	/**
	 * Status of plan, if currently shared
	 * @author jplacht
	 *
	 * @type {ComputedRef<boolean>}
	 */
	const isShared: ComputedRef<boolean> = computed(() => {
		return planningStore.shared[planUuid] != undefined;
	});

	/**
	 * Number of views this shared plan currently has
	 * @author jplacht
	 *
	 * @type {ComputedRef<number>}
	 */
	const viewCount: ComputedRef<number> = computed(() => {
		if (isShared.value) {
			return planningStore.shared[planUuid].view_count;
		}
		return 0;
	});

	/**
	 * Sharing URL if plan is shared
	 * @author jplacht
	 *
	 * @type {ComputedRef<string | undefined>}
	 */
	const url: ComputedRef<string | undefined> = computed(() => {
		if (isShared.value) {
			return `${config.SHARE_BASE_URL}/${planningStore.shared[planUuid].shared_uuid}`;
		}
		return undefined;
	});

	/**
	 * Triggers refresh of sharing information in Planning Store
	 * @author jplacht
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async function refreshStore(): Promise<void> {
		await planningStore.getSharedList();
	}

	/**
	 * Deletes active sharing
	 * @author jplacht
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async function deleteSharing(): Promise<void> {
		if (isShared) {
			// call share deletion
			await callDeleteSharing(planningStore.shared[planUuid].shared_uuid);
			// refresh shared data in store
			await refreshStore();
		}
	}

	/**
	 * Creates a new sharing for this plan
	 * @author jplacht
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async function createSharing(): Promise<void> {
		if (!isShared.value) {
			// call sharing creation
			await callCreateSharing(planUuid);
			// refresh shared data in store
			await refreshStore();
		}
	}

	return {
		isShared,
		viewCount,
		url,
		// functions
		refreshStore,
		deleteSharing,
		createSharing,
	};
}
