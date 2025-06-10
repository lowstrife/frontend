import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";
import axiosSetup from "@/util/axiosSetup";

// Services
import { apiService } from "@/lib/apiService";

import {
	callCreateCX,
	callDeleteCX,
	callGetCXList,
	callUpdateCXJunctions,
} from "@/features/api/cxData.api";

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

	it("callCreateCX", async () => {
		const spyApiServicePut = vi.spyOn(apiService, "put");

		mock.onPut("/cx/").reply(200, cx_list[0]);

		expect(await callCreateCX("foo")).toStrictEqual(cx_list[0]);
		expect(spyApiServicePut).toHaveBeenCalled();
	});

	it("callDeleteCX", async () => {
		const spyApiServiceDelete = vi.spyOn(apiService, "delete");

		mock.onDelete("/cx/foo").reply(200, true);

		expect(await callDeleteCX("foo")).toBeTruthy();
		expect(spyApiServiceDelete).toHaveBeenCalled();
	});

	it("callUpdateCXJunctions", async () => {
		const spyApiServicePatch = vi.spyOn(apiService, "patch");

		mock.onPatch("/cx/junctions").reply(200, []);

		expect(await callUpdateCXJunctions([])).toBeTruthy();
		expect(spyApiServicePatch).toHaveBeenCalled();
	});
});
