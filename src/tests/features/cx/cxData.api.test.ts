import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";
import axiosSetup from "@/util/axiosSetup";

// Services
import { apiService } from "@/lib/apiService";

import { callGetCXList } from "@/features/cx/cxData.api";

// test data
import cx_list from "@/tests/test_data/api_data_cx_list.json";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("CX Data API Calls", async () => {
	beforeAll(() => {
		setActivePinia(createPinia());
		axiosSetup();
	});

	it("callGetCXList", async () => {
		const spyApiServiceGet = vi.spyOn(apiService, "get");

		mock.onGet("/cx/").reply(200, cx_list);

		expect(await callGetCXList()).toStrictEqual(cx_list);
		expect(spyApiServiceGet).toHaveBeenCalled();
	});
});
