import { getDifferenceMinutes } from "@/util/date";
import { describe, expect, it } from "vitest";

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
});
