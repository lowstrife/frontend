import { describe, it, expect } from "vitest";
import { ref, reactive } from "vue";
import { inertClone } from "@/util/data";

describe("inertClone", () => {
	it("clones plain object deeply", () => {
		const original = { a: 1, b: { c: 2 } };
		const copy = inertClone(original);
		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
		expect(copy.b).not.toBe(original.b);
	});

	it("clones reactive object", () => {
		const original = reactive({ x: 10 });
		const copy = inertClone(original);
		expect(copy).toEqual({ x: 10 });
		expect(copy).not.toBe(original);
	});

	it("clones ref object", () => {
		const original = ref({ a: 1 });
		const copy = inertClone(original);
		expect(copy).toEqual({ a: 1 });
		expect(copy).not.toBe(original.value);
	});

	it("clones arrays deeply", () => {
		const original = [1, 2, { nested: true }];
		const copy = inertClone(original);
		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
		expect(copy[2]).not.toBe(original[2]);
	});

	it("clones ref arrays deeply", () => {
		const original = ref([{ a: 1 }, { b: 2 }]);
		const copy = inertClone(original);
		expect(copy).toEqual(original.value);
		expect(copy).not.toBe(original.value);
		// @ts-expect-error mock
		expect(copy[0]).not.toBe(original.value[0]);
	});

	it("clones reactive arrays deeply", () => {
		const original = reactive([{ x: 5 }, { y: 6 }]);
		const copy = inertClone(original);
		expect(copy).toEqual(original);
		expect(copy).not.toBe(original);
		expect(copy[0]).not.toBe(original[0]);
	});

	it("returns primitive values as-is", () => {
		expect(inertClone(42)).toBe(42);
		expect(inertClone("hello")).toBe("hello");
		expect(inertClone(null)).toBe(null);
		expect(inertClone(undefined)).toBe(undefined);
	});

	it("function as unclonable type, return input", () => {
		const fct = Function;
		expect(inertClone(fct)).toBe(fct);
	});

	describe("fallback: structuredClone fails on non-cloneable data", () => {
		it("falls back for function-containing objects (shallow copy)", () => {
			const original = { name: "bad", method: () => "fail" };
			const copy = inertClone(original);
			expect(copy).toEqual(original);
			expect(copy).not.toBe(original);
			expect(copy.method).toBe(original.method);
		});

		it("falls back for DOM element-containing objects (shallow copy)", () => {
			const div = document.createElement("div");
			const original = { id: 1, element: div };
			const copy = inertClone(original);
			expect(copy).toStrictEqual({ id: 1, element: {} });
			expect(copy).not.toBe(original);
			expect(copy.element).toStrictEqual({});
		});

		it("falls back if given a array of functions", () => {
			const original = [() => "f", () => "m"];
			const copy = inertClone(original);
			expect(copy).not.toBe(original);
		});

		it("falls back if given a date", () => {
			const original = new Date();
			const copy = inertClone(original);
			expect(copy).not.toBe(original);
		});
	});
});
