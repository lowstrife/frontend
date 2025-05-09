import { usePlanningStore } from "@/stores/planningStore";

export function useCXData() {
	const planningStore = usePlanningStore();

	function findEmpireCXUuid(
		empireUuid: string | undefined
	): string | undefined {
		// if the empire uuid is undefined, no cx can be found
		if (empireUuid === undefined) return undefined;

		//
		const cx = Object.values(planningStore.cxs).find((c) =>
			c.empires.some((e) => e.uuid === empireUuid)
		);

		return cx ? cx.uuid : undefined;
	}

	return {
		findEmpireCXUuid,
	};
}
