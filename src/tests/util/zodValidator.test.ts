import { PositiveOrZeroNumber } from "@/util/zodValidators";
import { describe, expect, it } from "vitest";

describe("Util: zodValidator", () => {
	describe("PositiveOrZeroNumber schema", () => {
		it("should pass for positive numbers", () => {
			const result = PositiveOrZeroNumber.safeParse(5);
			expect(result.success).toBe(true);
		});

		it("should pass for zero", () => {
			const result = PositiveOrZeroNumber.safeParse(0);
			expect(result.success).toBe(true);
		});

		it("should fail for negative numbers", () => {
			const result = PositiveOrZeroNumber.safeParse(-1);
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.errors[0].message).toBe(
					"Number must be 0 or positive"
				);
			}
		});
	});
});
