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

	describe("setters and getters", async () => {
		it("setEmpires", async () => {
			planningStore.setEmpires(empire_list);
			expect(Object.keys(planningStore.empires).length).toBe(2);
		});

		it("getAllEmpires", async () => {
			planningStore.setEmpires(empire_list);
			await expect(planningStore.getAllEmpires()).resolves.toStrictEqual(
				empire_list
			);
		});

		it("setPlan", async () => {
			planningStore.setPlan(plan_etherwind);
			const ewUuid: string = plan_etherwind.uuid;
			expect(planningStore.plans[ewUuid]).toBeDefined();
		});

		it("setPlan, no uuid", async () => {
			expect(() => planningStore.setPlan({ name: "foo" })).toThrowError();
		});

		it("setPlans", async () => {
			planningStore.setPlans([plan_etherwind, plan_etherwind]);
			// same uuid, one entry
			expect(Object.keys(planningStore.plans).length).toBe(1);
		});

		it("deletePlan", async () => {
			planningStore.setPlan(plan_etherwind);
			const ewUuid: string = plan_etherwind.uuid;
			expect(planningStore.plans[ewUuid]).toBeDefined();
			planningStore.deletePlan(ewUuid);
			expect(planningStore.plans[ewUuid]).toBeUndefined();
		});

		it("setCXs", async () => {
			planningStore.setCXs(cx_list);
			expect(Object.keys(planningStore.cxs).length).toBe(6);
		});

		it("setCXs", async () => {
			planningStore.setCXs(cx_list);
			await expect(planningStore.getAllCX()).resolves.toStrictEqual(
				cx_list
			);
		});

		it("getCX", async () => {
			planningStore.setCXs(cx_list);
			expect(
				planningStore.getCX("2a83a2ca-db0c-49d2-9c43-0db08c1675bb")
			).toBeDefined();
			expect(() => planningStore.getCX("foo")).toThrowError();
		});

		it("setSharedList", async () => {
			planningStore.setSharedList(shared_list);
			expect(Object.keys(planningStore.shared).length).toBe(2);
		});

		it("getSharedList", async () => {
			planningStore.setSharedList(shared_list);
			await expect(planningStore.getSharedList()).resolves.toStrictEqual(
				shared_list
			);
		});

		it("deleteShared", async () => {
			planningStore.setSharedList(shared_list);
			const sharedPlanUuid: string =
				"0fa56f16-a1cc-496a-9a39-bb93f172b9f4";
			planningStore.deleteShared(sharedPlanUuid);
			expect(Object.keys(planningStore.shared).length).toBe(1);
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
	});

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
