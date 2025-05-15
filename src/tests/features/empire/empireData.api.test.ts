import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";
import axiosSetup from "@/util/axiosSetup";

// Services
import { apiService } from "@/lib/apiService";

import {
	callGetEmpireList,
	callGetEmpirePlans,
	callPatchEmpire,
} from "@/features/empire/empireData.api";

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
});
