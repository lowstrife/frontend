import { describe, it, expect, beforeAll, vi } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { createPinia, setActivePinia } from "pinia";
import axiosSetup from "@/util/axiosSetup";

// Services
import { apiService } from "@/lib/apiService";
import { callOptimizeHabitation } from "@/features/api/optimize.api";

// test data
import optimize_habitation_result from "@/tests/test_data/api_data_optimize_habitation.json";

// mock apiService client
const mock = new AxiosMockAdapter(apiService.client);

describe("Optimization API Calls", async () => {
	beforeAll(() => {
		setActivePinia(createPinia());
		axiosSetup();
	});

	it("callOptimizeHabitation", async () => {
		const mockPayload = {
			pioneer: 490,
			settler: 685,
			technician: 420,
			engineer: 0,
			scientist: 0,
			cost_HBB: 46420,
			cost_HBC: 155678,
			cost_HBM: 810000,
			cost_HBL: 1378300,
			cost_HB1: 22400,
			cost_HB2: 20508,
			cost_HB3: 124860,
			cost_HB4: 476000,
			cost_HB5: 996900,
		};

		const spyApiServicePost = vi.spyOn(apiService, "post");

		mock.onPost("/optimize/habitation").reply(
			200,
			optimize_habitation_result
		);

		expect(await callOptimizeHabitation(mockPayload)).toStrictEqual(
			optimize_habitation_result
		);
		expect(spyApiServicePost).toHaveBeenCalled();
	});
});
