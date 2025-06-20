import { describe, it, expect, beforeAll, vi } from "vitest";

import { usePlanetSearchResults } from "@/features/planet_search/usePlanetSearchResults";

// test data
import planet_search_results from "@/tests/test_data/api_data_planet_search.json";
import planet_etherwind from "@/tests/test_data/api_data_planet_etherwind.json";

describe("usePlanetSearchResults", async () => {
	it("hasCheckDistance: ok", async () => {
		const { hasCheckDistance } = usePlanetSearchResults(
			// @ts-expect-error mock data
			planet_search_results,
			[]
		);

		expect(hasCheckDistance.value).toBe("Antares III");
	});

	it("hasCheckDistance: null", async () => {
		const { hasCheckDistance } = usePlanetSearchResults(
			// @ts-expect-error mock data
			[{ CheckDistances: null }],
			[]
		);

		expect(hasCheckDistance.value).toBe(null);
	});

	it("results: full", async () => {
		const { results } = usePlanetSearchResults(
			// @ts-expect-error mock data
			planet_search_results,
			["N"]
		);

		expect(results.value.length).toBe(60);
		expect(Object.keys(results.value[0].searchResources).length).toBe(1);
	});

	it("results: no distances", async () => {
		const { results } = usePlanetSearchResults(
			// @ts-expect-error mock data
			[planet_etherwind],
			["N"]
		);

		expect(results.value.length).toBe(1);
		expect(Object.keys(results.value[0].searchResources).length).toBe(0);
	});
});
