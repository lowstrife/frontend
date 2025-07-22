import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// stores
import { usePlanningStore } from "@/stores/planningStore";

// test data
import plan_etherwind from "@/tests/test_data/api_data_plan_etherwind.json";
import empire_list from "@/tests/test_data/api_data_empire_list.json";
import cx_list from "@/tests/test_data/api_data_cx_list.json";
import shared_list from "@/tests/test_data/api_data_shared_list.json";

const etherwindUuid: string = "41094cb6-c4bc-429f-b8c8-b81d02b3811c";

describe("Planning Store", async () => {
	let planningStore: any;

	beforeEach(() => {
		setActivePinia(createPinia());
		planningStore = usePlanningStore();

		vi.resetAllMocks();
	});

	describe("getPlan", async () => {
		it("plan uuid already fetched", async () => {
			planningStore.plans[etherwindUuid] = plan_etherwind;

			const result = await planningStore.getPlan(etherwindUuid);
			expect(result.uuid).toBe(etherwindUuid);
		});

		it("fetch non existing plan", async () => {
			await expect(() =>
				planningStore.getPlan("foo")
			).rejects.toThrowError();
		});
	});

	it("getAllPlans", async () => {
		planningStore.plans["foo"] = plan_etherwind;
		planningStore.plans["moo"] = plan_etherwind;

		const data = await planningStore.getAllPlans();
		expect(data).toStrictEqual([plan_etherwind, plan_etherwind]);
	});

	// describe("getAllEmpires", async () => {
	// 	it("empires were loaded, return", async () => {
	// 		empire_list.forEach((e) => {
	// 			planningStore.empires[e.uuid] = e;
	// 		});

	// 		const result = await planningStore.getAllEmpires();

	// 		expect(result.length).toBe(empire_list.length);
	// 	});
	// });

	// describe("getCX", async () => {
	// 	it("get valid cx", async () => {
	// 		cx_list.forEach((cx) => {
	// 			planningStore.cxs[cx.uuid] = cx;
	// 		});

	// 		const result = planningStore.getCX(cx_list[0].uuid);
	// 		expect(result).toStrictEqual(cx_list[0]);
	// 	});

	// 	it("get invalid cx, error", async () => {
	// 		expect(() => planningStore.getCX("meow")).toThrowError();
	// 	});
	// });

	// describe("getAllCX", async () => {
	// 	it("cxs were loaded, return", async () => {
	// 		cx_list.forEach((cx) => {
	// 			planningStore.cxs[cx.uuid] = cx;
	// 		});

	// 		const result = await planningStore.getAllCX();

	// 		expect(result.length).toBe(cx_list.length);
	// 	});
	// });

	// describe("getOrLoadEmpirePlans", async () => {
	// 	it("given planuuids, all already present", async () => {
	// 		planningStore.plans["foo"] = {};
	// 		planningStore.plans["moo"] = {};

	// 		const result = await planningStore.getOrLoadEmpirePlans("123", [
	// 			"foo",
	// 			"moo",
	// 		]);

	// 		expect(result).toStrictEqual([{}, {}]);
	// 	});

	// 	it("given plan uuids, load fresh", async () => {
	// 		planningStore.plans = {};

	// 		const result = await planningStore.getOrLoadEmpirePlans("123", [
	// 			"foo",
	// 			"moo",
	// 		]);
	// 	});
	// });

	// describe("getSharedList", async () => {
	// 	it("get valid shared", async () => {
	// 		const result = await planningStore.getSharedList();
	// 		expect(result).toStrictEqual(shared_list);
	// 		expect(Object.keys(planningStore.shared).length).toBe(
	// 			shared_list.length
	// 		);
	// 	});
	// });

	it("$reset", async () => {
		planningStore.plans = true;
		planningStore.empires = true;
		planningStore.cxs = true;
		planningStore.shared = true;

		planningStore.$reset();

		expect(planningStore.plans).toStrictEqual({});
		expect(planningStore.empires).toStrictEqual({});
		expect(planningStore.cxs).toStrictEqual({});
		expect(planningStore.shared).toStrictEqual({});
	});
});
