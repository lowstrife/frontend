import { describe, it, expect } from "vitest";

import { PlanLoadError } from "@/features/planning_data/usePlan.errors";

describe("PlanLoadError", () => {
	const errorCodes = [
		"UNIMPLEMENTED",
		"MISSING_PLANET_ID",
		"PLANET_FAILURE",
		"EMPIRE_FAILURE",
		"API_FAILURE",
	];

	errorCodes.forEach((code) => {
		it(`should create an error with code ${code}`, () => {
			const message = `Error with code ${code}`;

			// @ts-expect-error mocking error code from array
			const error = new PlanLoadError(code, message);

			expect(error.code).toBe(code);
			expect(error.message).toBe(message);
			expect(error.name).toBe("PlanLoadError");
		});
	});
});
