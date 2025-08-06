import { describe, it, expect, beforeEach, vi } from "vitest";
import { ref, reactive, markRaw } from "vue";
import { copyToClipboard, inertClone, redact } from "@/util/data";

describe("inertClone", () => {
	it("clones plain objects without reactivity", () => {
		const obj = { a: 1, b: { c: 2 } };
		const clone = inertClone(obj);
		expect(clone).toEqual(obj);
		expect(clone).not.toBe(obj);
		expect(clone.b).not.toBe(obj.b);
	});

	it("clones arrays", () => {
		const arr = [1, 2, 3];
		const clone = inertClone(arr);
		expect(clone).toEqual(arr);
		expect(clone).not.toBe(arr);
	});

	it("clones reactive objects and strips reactivity", () => {
		const reactiveObj = reactive({ foo: "bar" });
		const clone = inertClone(reactiveObj);
		expect(clone).toEqual({ foo: "bar" });
		expect(clone).not.toBe(reactiveObj);
	});

	it("clones ref values and unwraps them", () => {
		const someRef = ref({ hello: "world" });
		const clone = inertClone(someRef);
		expect(clone).toEqual({ hello: "world" });
		expect(clone).not.toBe(someRef.value);
	});

	it("returns primitives as-is", () => {
		expect(inertClone(123)).toBe(123);
		expect(inertClone("abc")).toBe("abc");
		expect(inertClone(null)).toBe(null);
		expect(inertClone(undefined)).toBe(undefined);
		expect(inertClone(true)).toBe(true);
	});

	it("clones objects with nested structuredClone-safe types", () => {
		const input = {
			date: new Date(),
			map: new Map([["a", 1]]),
			set: new Set([1, 2, 3]),
			buffer: new ArrayBuffer(8),
		};

		const clone = inertClone(input);
		expect(clone).not.toBe(input);
		expect(clone.date).not.toBe(input.date);
		expect(clone.date.getTime()).toBe(input.date.getTime());
		expect(clone.map instanceof Map).toBe(true);
		expect(clone.set instanceof Set).toBe(true);
		expect(clone.buffer).not.toBe(input.buffer);
	});

	it("shallow clones objects if structuredClone is unavailable (manual test)", () => {
		// This can only be tested properly by mocking structuredClone,
		// which is difficult in environments that polyfill it.
		// You can manually test fallback like this:
		const markedRaw = markRaw({ x: 42 });
		const clone = inertClone(markedRaw);
		expect(clone).toEqual({ x: 42 });
	});
});

describe("copyToClipboard", async () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it("call navigator.clipboard.writeText with correct value", async () => {
		const mockWriteText = vi.fn();
		Object.assign(navigator, {
			clipboard: {
				writeText: mockWriteText,
			},
		});

		const testValue = "Foo";
		copyToClipboard(testValue);

		expect(mockWriteText).toHaveBeenCalledWith(testValue);
		expect(mockWriteText).toHaveBeenCalledTimes(1);
	});
});

describe("redact", async () => {
	const keysToRedact: string[] = ["meow", "hello"];

	it("primitives as-is", async () => {
		const result = redact("foo", keysToRedact);
		expect(result).toStrictEqual("foo");
	});

	it("array, handle parts", async () => {
		const result = redact(["foo", { meow: "redact" }], keysToRedact);
		expect(result).toStrictEqual(["foo", { meow: "***" }]);
	});

	it("nested", async () => {
		const result = redact(
			{ foo: { meow: "redact" }, whoop: { foo: { hello: "redact" } } },
			keysToRedact
		);
		expect(result).toStrictEqual({
			foo: {
				meow: "***",
			},
			whoop: {
				foo: {
					hello: "***",
				},
			},
		});
	});
});
