import { toRaw, isRef } from "vue";

export function inertClone<T>(value: T): T {
	const raw = toRaw(isRef(value) ? value.value : value);

	try {
		return structuredClone(raw) as T;
	} catch (err) {
		console.warn(
			"[cloneFromStore] structuredClone failed, returning shallow clone:",
			err
		);

		if (Array.isArray(raw)) {
			return raw.slice() as T;
		}
		if (typeof raw === "object" && raw !== null) {
			return { ...raw } as T;
		} else {
			return raw as T;
		}
	}
}
