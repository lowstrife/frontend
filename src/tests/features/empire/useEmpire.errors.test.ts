import { describe, it, expect } from "vitest";

import { EmpireLoadError } from "@/features/empire/useEmpire.errors";

describe("EmpireLoadError", () => {
	const errorCodes = ["NO_EMPIRES", "API_FAILURE", "UNKNOWN"];

	errorCodes.forEach((code) => {
		it(`should create an error with code ${code}`, () => {
			const message = `Error with code ${code}`;

			// @ts-expect-error mocking error code from array
			const error = new EmpireLoadError(code, message);

			expect(error.code).toBe(code);
			expect(error.message).toBe(message);
			expect(error.name).toBe("EmpireLoadError");
		});
	});
});
