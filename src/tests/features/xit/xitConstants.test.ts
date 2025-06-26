import { describe, it, expect } from "vitest";

import { XITSTATIONWAREHOUSES } from "@/features/xit/xitConstants";

describe("xitConstants", async () => {
	it("XITSTATIONWAREHOUSES must have all warehouses + configure", async () => {
		expect(XITSTATIONWAREHOUSES.length).toBe(7);
	});
});
