import { setActivePinia, createPinia } from "pinia";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { useGameDataStore } from "@/stores/gameDataStore";
import { usePlanetData } from "@/features/game_data/usePlanetData";

// test data
import planet_single from "@/tests/test_data/api_data_planet_single.json";

describe("usePlanetData", async () => {
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();
	});

	beforeEach(() => {
		gameDataStore.buildings = {};
	});

	describe("getPlanet", async () => {
		it("Get valid planet", async () => {
			gameDataStore.planets["KW-020c"] = planet_single;
			const { getPlanet } = usePlanetData();

			expect(getPlanet("KW-020c")).toStrictEqual(planet_single);
		});
		it("Get invalid", async () => {
			const { getPlanet } = usePlanetData();

			expect(() => getPlanet("foo")).toThrowError();
		});
	});

	describe("getPlanetName", async () => {
		const fakeId: string = "KW-020c";

		it("With Name different to Natural Id", async () => {
			gameDataStore.planets[fakeId] = planet_single;
			const { getPlanetName } = usePlanetData();

			expect(getPlanetName(fakeId)).toBe("Milliways (KW-020c)");
		});

		it("With Name different to Natural Id", async () => {
			gameDataStore.planets[fakeId] = planet_single;
			gameDataStore.planets[fakeId].PlanetName =
				gameDataStore.planets[fakeId].PlanetNaturalId;
			const { getPlanetName } = usePlanetData();

			expect(getPlanetName(fakeId)).toBe(fakeId);
		});
	});

	describe("getPlanetSpecialMaterials", async () => {
		const specialMaterialCases = [
			{
				planet: { Surface: true },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
				],
				description: "With Surface",
			},
			{
				planet: { Surface: false },
				areaCost: 25,
				result: [
					{
						ticker: "AEF",
						input: 9,
						output: 0,
					},
				],
				description: "No Surface",
			},
			{
				planet: { Surface: true, Gravity: 0.249 },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
					{
						ticker: "MGC",
						input: 1,
						output: 0,
					},
				],
				description: "Low Gravity",
			},
			{
				planet: { Surface: true, Gravity: 2.51 },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
					{
						ticker: "BL",
						input: 1,
						output: 0,
					},
				],
				description: "High Gravity",
			},
			{
				planet: { Surface: true, Pressure: 0.249 },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
					{
						ticker: "SEA",
						input: 25,
						output: 0,
					},
				],
				description: "Low Pressure",
			},
			{
				planet: { Surface: true, Pressure: 2.01 },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
					{
						ticker: "HSE",
						input: 1,
						output: 0,
					},
				],
				description: "Low Pressure",
			},
			{
				planet: { Surface: true, Temperature: -25.01 },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
					{
						ticker: "INS",
						input: 250,
						output: 0,
					},
				],
				description: "Low Temperature",
			},
			{
				planet: { Surface: true, Temperature: 75.01 },
				areaCost: 25,
				result: [
					{
						ticker: "MCG",
						input: 100,
						output: 0,
					},
					{
						ticker: "TSH",
						input: 1,
						output: 0,
					},
				],
				description: "High Temperature",
			},
		];

		it.each(specialMaterialCases)(
			"Planet Special Materials: $description",
			async ({ planet, areaCost, result }) => {
				const { getPlanetSpecialMaterials } = usePlanetData();

				// @ts-expect-error mock planet data
				expect(getPlanetSpecialMaterials(planet, areaCost)).toStrictEqual(
					result
				);
			}
		);
	});
});
