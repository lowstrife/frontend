import { describe, it, expect, beforeAll, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { usePlanningStore } from "@/stores/planningStore";
import { useCXData } from "@/features/cx/useCXData";
import { useGameDataStore } from "@/stores/gameDataStore";

// test data
import exchanges from "@/tests/test_data/api_data_exchanges.json";

describe("useCXData", async () => {
	let planningStore: any;
	let gameDataStore: any;

	beforeAll(() => {
		setActivePinia(createPinia());
		planningStore = usePlanningStore();
		gameDataStore = useGameDataStore();

		exchanges.map((e) => {
			gameDataStore.exchanges[e.TickerId] = e;
		});
	});

	describe("findEmpireCXUuid", async () => {
		it("undefined empire uuid", async () => {
			const { findEmpireCXUuid } = useCXData();

			expect(findEmpireCXUuid(undefined)).toBeUndefined();
		});

		it("unknown empire uuid", async () => {
			const { findEmpireCXUuid } = useCXData();

			expect(findEmpireCXUuid("foo")).toBeUndefined();
		});

		it("valid cx uuid", async () => {
			planningStore.cxs["foo"] = { uuid: "foo", empires: [{ uuid: "moo" }] };
			const { findEmpireCXUuid } = useCXData();

			expect(findEmpireCXUuid("moo")).toBe("foo");
		});
	});
});
