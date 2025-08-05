import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";

// Composables
import { useFIOStorage } from "@/features/fio/useFIOStorage";

// test data
import fio_storage from "@/tests/test_data/api_data_fio_storage.json";

// stores
import { useGameDataStore } from "@/stores/gameDataStore";

describe("useFIOStorage", async () => {
	beforeEach(() => {
		setActivePinia(createPinia());

		const gameDataStore = useGameDataStore();
		gameDataStore.$reset();
	});

	describe("hasStorage", async () => {
		it("hasStorage - none", async () => {
			const { hasStorage } = useFIOStorage();

			expect(hasStorage.value).toBeFalsy();
		});

		it("hasStorage - yes", async () => {
			const gameDataStore = useGameDataStore();
			// @ts-expect-error test data
			gameDataStore.setFIOStorageData(fio_storage);

			const { hasStorage } = useFIOStorage();
			expect(hasStorage.value).toBeTruthy();
		});
	});

	describe("findStorageValueFromOptions", async () => {
		it("not available, default to 0", async () => {
			const { findStorageValueFromOptions } = useFIOStorage();

			expect(findStorageValueFromOptions(undefined, "RAT")).toBe(0);
			expect(findStorageValueFromOptions("PLANET#FOO", "RAT")).toBe(0);
			expect(findStorageValueFromOptions("WAR#FOO", "RAT")).toBe(0);
			expect(findStorageValueFromOptions("SHIP#FOO", "RAT")).toBe(0);
		});

		it("available and valid data", async () => {
			const gameDataStore = useGameDataStore();
			// @ts-expect-error test data
			gameDataStore.setFIOStorageData(fio_storage);

			const { findStorageValueFromOptions } = useFIOStorage();

			expect(findStorageValueFromOptions("PLANET#ZV-307c", "PWO")).toBe(
				6
			);
			expect(findStorageValueFromOptions("WAR#ANT", "PWO")).toBe(279);
			expect(findStorageValueFromOptions("SHIP#AVI-04WD9", "H2O")).toBe(
				467
			);
		});
	});

	it("storageOptions", async () => {
		const gameDataStore = useGameDataStore();
		// @ts-expect-error test data
		gameDataStore.setFIOStorageData(fio_storage);

		const { storageOptions } = useFIOStorage();

		expect(storageOptions.value[0]).toBeDefined();
		expect(storageOptions.value[0].value).toBeUndefined();
		expect(storageOptions.value[1].children).toBeDefined();
		expect(storageOptions.value[2].children).toBeDefined();
		expect(storageOptions.value[3].children).toBeDefined();
	});
});
