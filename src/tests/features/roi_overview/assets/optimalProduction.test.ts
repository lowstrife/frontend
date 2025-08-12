import { describe, expect, it } from "vitest";

import { optimalProduction } from "@/features/roi_overview/assets/optimalProduction";

describe("optimalProduction", async () => {
	it("should have all buildings", async () => {
		expect(optimalProduction.length).toBe(48);
	});
});
