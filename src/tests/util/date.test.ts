import { describe, expect, it } from "vitest";
import {
	formatDate,
	getDifferenceMinutes,
	timestampFromString,
} from "@/util/date";

describe("Util: date", () => {
	describe("getDifferenceMinutes", () => {
		it("defined", () => {
			const startDate: Date = new Date(1745834400000);
			const endDate: Date = new Date(1745834100000);

			const minutes: number = getDifferenceMinutes(startDate, endDate);

			expect(minutes).toBe(5);
		});

		it("start undefined", () => {
			const startDate: Date = new Date(1745834400000);

			const minutes: number = getDifferenceMinutes(startDate, undefined);

			expect(minutes).toBe(0);
		});

		it("end undefined", () => {
			const endDate: Date = new Date(1745834100000);

			const minutes: number = getDifferenceMinutes(undefined, endDate);

			expect(minutes).toBe(0);
		});
	});

	describe("timestampFromString", () => {
		it("Return Unix timestamp from Date as String", () => {
			const result: number = timestampFromString("2025-05-01");

			expect(result).toBe(1746050400000);
		});
	});

	describe("formatDate", () => {
		it("Standard YYYY-MM-DD format", () => {
			const testDate: Date = new Date(2025, 0, 1);

			const result: string = formatDate(testDate);

			expect(result).toBe("2025-01-01");
		});

		it("Custom YYYY-MM format", () => {
			const testDate: Date = new Date(2025, 0, 1);

			const result: string = formatDate(testDate, "YYYY-MM");

			expect(result).toBe("2025-01");
		});
	});
});
