import { describe, expect, it } from "vitest";
import { formatNumber } from "@/util/numbers";

describe("Util: text", () => {
	describe("formatNumber", () => {
		it("default config", () => {
			const result = formatNumber(5);
			expect(result).toStrictEqual("5.00");
		});

		it("infinity", () => {
			const result = formatNumber(Infinity);
			expect(result).toStrictEqual("∞");
		});

		it("special format", () => {
			const result = formatNumber(123.52115, 4);
			expect(result).toStrictEqual("123.5212");
		});

		it("optional decimals", () => {
			const result = formatNumber(123.5, 4, true);
			expect(result).toStrictEqual("123.5000");
		});
	});
});
