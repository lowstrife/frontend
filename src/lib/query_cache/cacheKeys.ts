import { JSONObject, JSONValue } from "@/lib/query_cache/queryCache.types";

export function toCacheKey(key: JSONValue): string {
	return JSON.stringify(key, (_, val) => {
		if (val === null || typeof val !== "object" || Array.isArray(val)) {
			return val;
		}

		return Object.keys(val)
			.sort()
			.reduce(
				(result, key) => {
					result[key] = val[key];
					return result;
				},
				{} as Record<string, unknown>
			);
	});
}

export function isSubset(subSet: JSONValue, fullSet: JSONValue): boolean {
	if (subSet === fullSet) return true;

	if (typeof subSet !== typeof fullSet) return false;

	if (Array.isArray(subSet) && Array.isArray(fullSet)) {
		if (subSet.length > fullSet.length) return false;
		for (let i = 0; i < subSet.length; i++) {
			if (!isSubset(subSet[i], fullSet[i])) return false;
		}
		return true;
	}

	if (
		typeof subSet === "object" &&
		typeof fullSet === "object" &&
		subSet !== null &&
		fullSet !== null
	) {
		const subKeys = Object.keys(subSet);
		for (const key of subKeys) {
			if (!(key in fullSet)) return false;
			if (
				!isSubset(
					(subSet as JSONObject)[key],
					(fullSet as JSONObject)[key]
				)
			) {
				return false;
			}
		}
		return true;
	}

	return false;
}
