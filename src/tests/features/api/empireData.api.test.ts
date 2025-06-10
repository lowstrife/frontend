import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";
import axiosSetup from "@/util/axiosSetup";

// Services
import { apiService } from "@/lib/apiService";

import {
	callCreateEmpire,
	callDeleteEmpire,
	callGetEmpireList,
	callGetEmpirePlans,
	callPatchEmpire,
	callPatchEmpirePlanJunctions,
} from "@/features/api/empireData.api";

// test data
import empire_list from "@/tests/test_data/api_data_empire_list.json";
import plan_etherwind from "@/tests/test_data/api_data_plan_etherwind.json";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("Empire Data API Calls", async () => {
	beforeAll(() => {
		setActivePinia(createPinia());
		axiosSetup();
	});

	it("callGetEmpireList", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/empire/").reply(200, empire_list);

		expect(await callGetEmpireList()).toStrictEqual(empire_list);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callGetEmpirePlans", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		const fakeEmpireUuid: string = "foo";

		mock
			.onGet(`/baseplanner/empire/${fakeEmpireUuid}`)
			.reply(200, [plan_etherwind, plan_etherwind]);

		expect(await callGetEmpirePlans(fakeEmpireUuid)).toStrictEqual([
			plan_etherwind,
			plan_etherwind,
		]);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});

	it("callPatchEmpire", async () => {
		const spyApiServicePatch = vi.spyOn(apiService, "patch");

		const fakeEmpireUuid: string = "f39c84a5-e7ba-4aeb-a04d-0618df58fd74";
		const fakePatchPayload = {
			faction: "NONE",
			permits_used: 1,
			permits_total: 2,
			name: "CAAP",
			use_fio_storage: false,
		};
		const fakePatchResponse = {
			faction: "NONE",
			permits_used: 1,
			permits_total: 2,
			uuid: "f39c84a5-e7ba-4aeb-a04d-0618df58fd74",
			name: "CAAP",
			use_fio_storage: false,
		};

		mock.onPatch(`/empire/${fakeEmpireUuid}`).reply(200, fakePatchResponse);

		expect(
			// @ts-expect-error mock data
			await callPatchEmpire(fakeEmpireUuid, fakePatchPayload)
		).toStrictEqual(fakePatchResponse);

		expect(spyApiServicePatch).toHaveBeenCalled();
	});

	it("callCreateEmpire", async () => {
		const spyApiServicePut = vi.spyOn(apiService, "put");

		const fakeEmpireUuid: string = "f39c84a5-e7ba-4aeb-a04d-0618df58fd74";
		const fakePutPayload = {
			faction: "NONE",
			permits_used: 1,
			permits_total: 2,
			name: "CAAP",
			use_fio_storage: false,
		};
		const fakePutResponse = {
			faction: "NONE",
			permits_used: 1,
			permits_total: 2,
			uuid: "f39c84a5-e7ba-4aeb-a04d-0618df58fd74",
			name: "CAAP",
			use_fio_storage: false,
		};

		mock.onPut(`/empire/`).reply(200, fakePutResponse);

		// @ts-expect-error mock data
		expect(await callCreateEmpire(fakePutPayload)).toStrictEqual(
			fakePutResponse
		);

		expect(spyApiServicePut).toHaveBeenCalled();
	});

	it("callDeleteEmpire", async () => {
		const spyApiServiceDelete = vi.spyOn(apiService, "delete");

		mock.onDelete("/empire/foo").reply(200, true);

		expect(await callDeleteEmpire("foo")).toBeTruthy();
		expect(spyApiServiceDelete).toHaveBeenCalled();
	});

	it("callPatchEmpirePlanJunctions", async () => {
		const spyApiServicePatch = vi.spyOn(apiService, "patch");

		mock.onPatch("/empire/junctions").reply(200, empire_list);

		expect(await callPatchEmpirePlanJunctions([])).toStrictEqual(empire_list);
		expect(spyApiServicePatch).toHaveBeenCalled();
	});
});
