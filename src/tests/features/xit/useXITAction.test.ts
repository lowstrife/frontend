import { ref } from "vue";
import { createPinia, setActivePinia } from "pinia";
import { describe, it, expect, beforeAll } from "vitest";

// Stores
import { useGameDataStore } from "@/stores/gameDataStore";

// Composables
import { useXITAction } from "@/features/xit/useXITAction";

// Types & Interfaces
import { IXITActionElement } from "@/features/xit/xitAction.types";

// test data
import materials from "@/tests/test_data/api_data_materials.json";

describe("useXITAction", async () => {
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		gameDataStore = useGameDataStore();

		materials.forEach((m) => {
			gameDataStore.materials[m.Ticker] = m;
		});
	});

	const elements: IXITActionElement[] = [
		{
			ticker: "ALO",
			stock: 10,
			delta: -2,
		},
		{
			ticker: "FEO",
			stock: 10,
			delta: 1,
		},
		{
			ticker: "LST",
			stock: 25,
			delta: -5.1,
		},
		{
			ticker: "EPO",
			stock: 100,
			delta: -1,
		},
		{
			ticker: "H",
			stock: 30,
			delta: 5,
		},
	];
	const resupplyDays: number = 5;
	const hideInfinite: boolean = true;
	const materialOverrides: Record<string, number> = {
		ALO: 10,
	};
	const materialInactives: Set<string> = new Set(["FEO"]);

	it("materialTable", async () => {
		const { materialTable } = useXITAction(
			ref(elements),
			ref(resupplyDays),
			ref(hideInfinite),
			ref(materialOverrides),
			ref(materialInactives)
		);

		expect(materialTable.value.length).toBe(3);
		expect(materialTable.value[0].total).toBe(10);
		expect(materialTable.value[1].total).toBe(1);
		expect(materialTable.value[2].total).toBe(0);
	});

	it("totalWeightVolume", async () => {
		const { totalWeightVolume } = useXITAction(
			ref(elements),
			ref(resupplyDays),
			ref(hideInfinite),
			ref(materialOverrides),
			ref(materialInactives)
		);

		expect(totalWeightVolume.value.totalWeight).toBe(16.230000257492065);
		expect(totalWeightVolume.value.totalVolume).toBe(11);
	});

	it("generateTransferJSON", async () => {
		const { generateTransferJSON } = useXITAction(
			ref(elements),
			ref(resupplyDays),
			ref(hideInfinite),
			ref(materialOverrides),
			ref(materialInactives)
		);

		const r_one: string = generateTransferJSON().value;
		const r_two: string = generateTransferJSON("foo").value;
		const r_three: string = generateTransferJSON("foo", "Moo", "Foo").value;

		expect(r_one).toBe(
			'{"actions":[{"type":"MTRA","name":"TransferAction","group":"A1","origin":"Configure on Execution","dest":"Configure on Execution"}],"global":{"name":"PRUNplanner"},"groups":[{"type":"Manual","name":"A1","materials":{"ALO":10,"LST":1}}]}'
		);
		expect(r_two).toContain("foo");
		expect(r_three).toContain("Moo");
		expect(r_three).toContain("Foo");
	});
});
