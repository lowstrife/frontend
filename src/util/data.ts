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

/**
 * Recursively walk `obj` and replace any property whose key
 * is in `keysToRedact` with '***'.
 */
export function redact<T>(obj: T, keysToRedact: string[]): T {
	// array, redact all items
	if (Array.isArray(obj)) {
		return obj.map((item) => redact(item, keysToRedact)) as T;
	}

	if (obj !== null && typeof obj === "object") {
		return Object.entries(obj).reduce(
			(acc, [key, value]) => {
				if (keysToRedact.includes(key)) {
					// replace the field

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(acc as any)[key] = "***";
				} else {
					// recursive into nested objects/arrays
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(acc as any)[key] = redact(value, keysToRedact);
				}
				return acc;
			},
			Array.isArray(obj) ? [] : {}
		) as T;
	}

	// primitive value
	return obj;
}
