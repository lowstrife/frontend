import { describe, expect, it } from "vitest";
import { capitalizeString } from "@/util/text";

describe("Util: text", () => {
	describe("capitalizeString", () => {
		it("capitalize single", () => {
			const result = capitalizeString("foo");
			expect(result).toStrictEqual("Foo");
		});

		it("capitalize multiple", () => {
			const result = capitalizeString("foo moo");
			expect(result).toStrictEqual("Foo Moo");
		});
	});
});
