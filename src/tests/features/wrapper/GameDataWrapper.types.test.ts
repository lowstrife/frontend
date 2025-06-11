import { describe, expect, it } from "vitest";

import { LOADING_STATUS_ENUM } from "@/features/wrapper/GameDataWrapper.types";

describe("GameDataWrapper Types", async () => {
	describe("LOADING_STATUS_ENUM", () => {
		it("should contain correct enum values", () => {
			expect(LOADING_STATUS_ENUM.SKIP).toBe("SKIP");
			expect(LOADING_STATUS_ENUM.LOAD).toBe("LOAD");
			expect(LOADING_STATUS_ENUM.DONE).toBe("DONE");
			expect(LOADING_STATUS_ENUM.ERROR).toBe("ERROR");
		});

		it("should have 4 keys", () => {
			expect(Object.keys(LOADING_STATUS_ENUM)).toHaveLength(4);
		});
	});
});
