import { toRaw, isRef } from "vue";

export function inertClone<T>(value: T): T {
	const raw = toRaw(isRef(value) ? value.value : value);

	try {
		return structuredClone(raw) as T;
	} catch {
		if (Array.isArray(raw)) {
			return raw.slice() as T;
		}
		if (typeof raw === "object" && raw !== null) {
			return { ...raw } as T;
		}

		return raw as T;
	}
}

/**
 * Copies string value to users clipboard
 * @author jplacht
 *
 * @export
 * @param {string} value Text
 */
export function copyToClipboard(value: string): void {
	navigator.clipboard.writeText(value);
}
