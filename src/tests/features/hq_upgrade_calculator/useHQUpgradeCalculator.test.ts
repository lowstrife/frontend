import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// Composables
import { useHQUpgradeCalculator } from "@/features/hq_upgrade_calculator/useHQUpgradeCalculator";

// stores
import { useGameDataStore } from "@/stores/gameDataStore";

// test data
import materials from "@/tests/test_data/api_data_materials.json";
import exchanges from "@/tests/test_data/api_data_exchanges.json";
import { ref } from "vue";

describe("useHQUpgradeCalculator", async () => {
	const refStart = ref(1);
	const refTo = ref(3);
	const refOverride = ref({});
	const refCXUuid = ref(undefined);

	beforeEach(() => {
		setActivePinia(createPinia());

		const gameDataStore = useGameDataStore();
		gameDataStore.setMaterials(materials);
		gameDataStore.setExchanges(exchanges);
	});

	it("levelOptions", async () => {
		const { levelOptions, levelOptionsTo } = useHQUpgradeCalculator(
			refStart,
			refTo,
			refOverride,
			refCXUuid
		);

		expect(levelOptions.length).toBeGreaterThan(1);
		expect(levelOptionsTo.value.length).toBe(levelOptions.length);
	});

	it("materialData", async () => {
		const { materialData } = useHQUpgradeCalculator(
			refStart,
			refTo,
			refOverride,
			refCXUuid
		);
		expect(materialData.value).toBeDefined();
		expect(materialData.value.length).toBeGreaterThan(1);
	});

	it("totalCost", async () => {
		const { totalCost } = useHQUpgradeCalculator(
			refStart,
			refTo,
			refOverride,
			refCXUuid
		);
		expect(totalCost.value).toBeDefined();
		expect(totalCost.value).toBeGreaterThan(1);
	});

	it("totalWeightVolume", async () => {
		const { totalWeightVolume } = useHQUpgradeCalculator(
			refStart,
			refTo,
			refOverride,
			refCXUuid
		);
		expect(Object.keys(totalWeightVolume.value).length).toBe(2);
		expect(totalWeightVolume.value.totalVolume).toBeDefined();
		expect(totalWeightVolume.value.totalWeight).toBeDefined();
	});
});
