import { describe, it, expect, beforeEach, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// mocks
vi.mock("@/features/api/planData.api", async () => {
	return {
		...(await vi.importActual("@/features/api/planData.api")),
		callGetPlan: vi.fn(),
		callGetPlanlist: vi.fn(),
	};
});

vi.mock("@/features/api/sharingData.api", async () => {
	return {
		...(await vi.importActual("@/features/api/sharingData.api")),
		callGetSharedList: vi.fn(),
	};
});

vi.mock("@/features/api/cxData.api", async () => {
	return {
		...(await vi.importActual("@/features/api/cxData.api")),
		callGetCXList: vi.fn(),
	};
});

vi.mock("@/features/api/empireData.api", async () => {
	return {
		...(await vi.importActual("@/features/api/empireData.api")),
		callGetEmpireList: vi.fn(),
		callGetEmpirePlans: vi.fn(),
	};
});

import { callGetPlan, callGetPlanlist } from "@/features/api/planData.api";

import {
	callGetEmpireList,
	callGetEmpirePlans,
} from "@/features/api/empireData.api";
import { callGetCXList } from "@/features/api/cxData.api";
import { callGetSharedList } from "@/features/api/sharingData.api";

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

		it("fetch new plan, ok", async () => {
			// @ts-expect-error mock data
			vi.mocked(callGetPlan).mockResolvedValue(plan_etherwind);
			const result = await planningStore.getPlan(etherwindUuid);
			expect(result.uuid).toBe(etherwindUuid);
			expect(callGetPlan).toBeCalledTimes(1);
		});

		it("fetch new plan, error", async () => {
			vi.mocked(callGetPlan).mockRejectedValueOnce(new Error());

			await expect(
				planningStore.getPlan(etherwindUuid)
			).rejects.toThrowError();
		});
	});

	describe("getAllPlans", async () => {
		it("fetch new plans, ok", async () => {
			vi.mocked(callGetPlanlist).mockResolvedValue([
				// @ts-expect-error mock data
				plan_etherwind,
			]);
			const result = await planningStore.getAllPlans();
			expect(result.length).toBe(1);
			expect(callGetPlanlist).toBeCalledTimes(1);
		});

		it("fetch new plan, error", async () => {
			vi.mocked(callGetPlanlist).mockRejectedValueOnce(new Error());

			await expect(planningStore.getAllPlans).rejects.toThrowError();
		});

		it("fetch new plan, no plans found, 404", async () => {
			vi.mocked(callGetPlanlist).mockRejectedValueOnce(
				new Error("HTTP 404")
			);

			const result = await planningStore.getAllPlans();
			expect(result.length).toBe(0);
			expect(callGetPlanlist).toBeCalledTimes(1);
		});
	});

	describe("getAllEmpires", async () => {
		it("empires were loaded, return", async () => {
			empire_list.forEach((e) => {
				planningStore.empires[e.uuid] = e;
			});

			const result = await planningStore.getAllEmpires();

			expect(result.length).toBe(empire_list.length);
		});

		it("no empires, try to fetch all with error", async () => {
			planningStore.empires = {};

			vi.mocked(callGetEmpireList).mockRejectedValueOnce(new Error());

			await expect(planningStore.getAllEmpires()).rejects.toThrowError();
		});

		it("no empires, try to fetch all with success", async () => {
			planningStore.empires = {};

			vi.mocked(callGetEmpireList).mockResolvedValueOnce(empire_list);

			const result = await planningStore.getAllEmpires();

			expect(result.length).toBe(empire_list.length);
		});
	});

	describe("getCX", async () => {
		it("get valid cx", async () => {
			cx_list.forEach((cx) => {
				planningStore.cxs[cx.uuid] = cx;
			});

			const result = planningStore.getCX(cx_list[0].uuid);
			expect(result).toStrictEqual(cx_list[0]);
		});

		it("get invalid cx, error", async () => {
			expect(() => planningStore.getCX("meow")).toThrowError();
		});
	});

	describe("getAllCX", async () => {
		it("cxs were loaded, return", async () => {
			cx_list.forEach((cx) => {
				planningStore.cxs[cx.uuid] = cx;
			});

			const result = await planningStore.getAllCX();

			expect(result.length).toBe(cx_list.length);
		});

		it("no cxs, try to fetch all with error", async () => {
			planningStore.cxs = {};

			vi.mocked(callGetCXList).mockRejectedValueOnce(new Error());

			await expect(planningStore.getAllCX()).rejects.toThrowError();
		});

		it("no cxs, try to fetch all with success", async () => {
			planningStore.cxs = {};

			// @ts-expect-error mock data
			vi.mocked(callGetCXList).mockResolvedValueOnce(cx_list);

			const result = await planningStore.getAllCX();

			expect(result.length).toBe(cx_list.length);
		});
	});

	describe("getOrLoadEmpirePlans", async () => {
		it("given planuuids, all already present", async () => {
			planningStore.plans["foo"] = {};
			planningStore.plans["moo"] = {};

			const result = await planningStore.getOrLoadEmpirePlans("123", [
				"foo",
				"moo",
			]);

			expect(result).toStrictEqual([{}, {}]);
		});

		it("given plan uuids, load fresh", async () => {
			planningStore.plans = {};

			const mockResponse = [{ uuid: "foo" }, { uuid: "moo" }];

			// @ts-expect-error mock data
			vi.mocked(callGetEmpirePlans).mockResolvedValueOnce(mockResponse);

			const result = await planningStore.getOrLoadEmpirePlans("123", [
				"foo",
				"moo",
			]);
			expect(result).toStrictEqual(mockResponse);
		});
	});

	describe("getSharedList", async () => {
		it("get valid shared", async () => {
			const mockResponse = shared_list;

			vi.mocked(callGetSharedList).mockResolvedValueOnce(mockResponse);

			const result = await planningStore.getSharedList();
			expect(result).toStrictEqual(shared_list);
			expect(Object.keys(planningStore.shared).length).toBe(
				shared_list.length
			);
		});

		it("api error", async () => {
			vi.mocked(callGetSharedList).mockRejectedValueOnce(new Error());

			await expect(planningStore.getSharedList()).rejects.toThrowError();
		});
	});

	describe("resetter", async () => {
		it("reset plans", async () => {
			planningStore.plans["foo"] = "moo";

			planningStore.resetPlans();
			expect(Object.keys(planningStore.plans).length).toBe(0);
		});

		it("reset empires", async () => {
			planningStore.empires["foo"] = "moo";

			planningStore.resetEmpires();
			expect(Object.keys(planningStore.empires).length).toBe(0);
		});

		it("reset cxs", async () => {
			planningStore.cxs["foo"] = "moo";

			planningStore.resetCXS();
			expect(Object.keys(planningStore.cxs).length).toBe(0);
		});

		it("reset shared", async () => {
			planningStore.shared["foo"] = "moo";

			planningStore.resetShared();
			expect(Object.keys(planningStore.shared).length).toBe(0);
		});
	});
});
