import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";
import axiosSetup from "@/util/axiosSetup";

// Services
import { apiService } from "@/lib/apiService";

import {
	callGetPlan,
	callGetShared,
	callCreatePlan,
	callSavePlan,
	callGetPlanlist,
	callDeletePlan,
	callClonePlan,
	callPatchPlanMaterialIO,
} from "@/features/api/planData.api";

// test data
import plan_etherwind from "@/tests/test_data/api_data_plan_etherwind.json";
import shared from "@/tests/test_data/api_data_shared.json";
import patch_materialio from "@/tests/test_data/api_data_plan_materialio_patch.json";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("PlanData API Calls", async () => {
	const etherwindUuid: string = "41094cb6-c4bc-429f-b8c8-b81d02b3811c";
	const sharedUuid: string = "0f7161c8-7bc9-4ab6-af4a-10105be4180a";
	const fakeUuid: string = "41094cb6-c4bc-429f-b8c8-b81d02b3811c";

	const fakeSaveCreateData = {
		name: "meow",
		planet_id: "foo",
		faction: "NONE",
		override_empire: false,
		permits_used: 1,
		permits_total: 3,
		planet: {
			planetid: "foo",
			permits: 3,
			corphq: true,
			cogc: "RESOURCE_EXTRACTION",
			experts: [],
			workforce: [],
		},
		infrastructure: [],
		buildings: [],
		empire_uuid: fakeUuid,
	};

	beforeAll(() => {
		setActivePinia(createPinia());
		axiosSetup();
	});

	it("callGetPlan", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet(`/baseplanner/${etherwindUuid}`).reply(200, plan_etherwind);

		expect(await callGetPlan(etherwindUuid)).toStrictEqual(plan_etherwind);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callGetPlanlist", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet(`/baseplanner/`).reply(200, [plan_etherwind]);

		expect(await callGetPlanlist()).toStrictEqual([plan_etherwind]);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callGetShared", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet(`/shared/${sharedUuid}`).reply(200, shared);

		expect(await callGetShared(sharedUuid)).toStrictEqual(shared);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callCreatePlan", async () => {
		const spyApiServicePut = vi.spyOn(apiService, "put");

		mock.onPut("/baseplanner/").reply(200, { uuid: fakeUuid });

		// @ts-expect-error mock data
		expect(await callCreatePlan(fakeSaveCreateData)).toStrictEqual({
			uuid: fakeUuid,
		});
		expect(spyApiServicePut).toHaveBeenCalled();
	});

	it("callSavePlan", async () => {
		const spyApiServicePatch = vi.spyOn(apiService, "patch");

		mock.onPatch(`/baseplanner/${fakeUuid}`).reply(200, { uuid: fakeUuid });

		expect(
			// @ts-expect-error mock data
			await callSavePlan(fakeUuid, {
				uuid: fakeUuid,
				...fakeSaveCreateData,
			})
		).toStrictEqual({
			uuid: fakeUuid,
		});
		expect(spyApiServicePatch).toHaveBeenCalled();
	});

	it("callClonePlan", async () => {
		const spyApiServicePut = vi.spyOn(apiService, "put");

		mock.onPut("/baseplanner/foo/clone").reply(200, { message: "yay" });

		expect(await callClonePlan("foo", "meow")).toStrictEqual({
			message: "yay",
		});
		expect(spyApiServicePut).toHaveBeenCalled();
	});

	it("callDeletePlan", async () => {
		const spyApiServiceDelete = vi.spyOn(apiService, "delete");

		mock.onDelete("/baseplanner/foo").reply(200, true);

		expect(await callDeletePlan("foo")).toBeTruthy();
		expect(spyApiServiceDelete).toHaveBeenCalled();
	});

	it("callPatchPlanMaterialIO", async () => {
		const spyApiServicePatch = vi.spyOn(apiService, "patch");

		mock.onPatch("/baseplanner/materialio").reply(200, true);

		expect(await callPatchPlanMaterialIO(patch_materialio)).toBeTruthy();
		expect(spyApiServicePatch).toHaveBeenCalled();
	});
});
