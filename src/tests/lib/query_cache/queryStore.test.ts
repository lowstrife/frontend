import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useQueryStore } from "@/lib/query_cache/queryStore";

const mockFetch = vi.fn();

const mockDefinition = {
	key: (params: any) => ({ id: params?.id }),
	fetchFn: mockFetch,
	expireTime: 1000,
	autoRefetch: false,
	persist: true,
};

describe("queryStore", () => {
	let store: ReturnType<typeof useQueryStore>;

	beforeEach(() => {
		setActivePinia(createPinia());
		store = useQueryStore();
		mockFetch.mockReset();
	});

	it("peekQueryState returns undefined if key is unknown", () => {
		expect(store.peekQueryState({ id: 1 })).toBeUndefined();
	});

	it("peekQueryState returns undefined if key is expired", async () => {
		mockFetch.mockResolvedValueOnce("data");
		await store.executeQuery(mockDefinition, { id: 1 });

		// simulate expiration
		const state = store.peekQueryState({ id: 1 })!;
		state.timestamp = Date.now() - 2000;

		const result = store.peekQueryState({ id: 1 });
		expect(result).toBeUndefined();
	});

	it("executeQuery caches and returns result", async () => {
		mockFetch.mockResolvedValueOnce("data");
		const result = await store.executeQuery(mockDefinition, { id: 1 });
		expect(result).toBe("data");

		const state = store.peekQueryState({ id: 1 });
		expect(state?.data).toBe("data");
		expect(state?.loading).toBe(false);
	});

	it("executeQuery returns cached result if fresh", async () => {
		mockFetch.mockResolvedValueOnce("cached");
		await store.executeQuery(mockDefinition, { id: 1 });

		mockFetch.mockClear();
		const result = await store.executeQuery(mockDefinition, { id: 1 });
		expect(result).toBe("cached");
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("executeQuery refetches if forceRefetch is true", async () => {
		mockFetch.mockResolvedValueOnce("first");
		await store.executeQuery(mockDefinition, { id: 1 });

		mockFetch.mockResolvedValueOnce("second");
		const result = await store.executeQuery(
			mockDefinition,
			{ id: 1 },
			{ forceRefetch: true }
		);
		expect(result).toBe("second");
	});

	it("invalidateKey deletes exact key", async () => {
		mockFetch.mockResolvedValueOnce("data");
		await store.executeQuery(mockDefinition, { id: 1 });

		await store.invalidateKey({ id: 1 });
		expect(store.peekQueryState({ id: 1 })).toBeUndefined();
	});

	it("invalidates subset keys when exact is false", async () => {
		const def = { ...mockDefinition, persist: true };

		mockFetch.mockResolvedValueOnce("data1");
		await store.executeQuery(def, { id: "a", type: "a" });

		mockFetch.mockResolvedValueOnce("data2");
		await store.executeQuery(def, { id: "a", type: "b" });

		mockFetch.mockResolvedValueOnce("data3");
		await store.executeQuery(def, { id: "b", type: "b" });

		// Invalidate all entries with type: "a"
		await store.invalidateKey({ id: "a" }, { exact: false });

		expect(store.peekQueryState({ id: "a" })).toBeUndefined();
		expect(store.peekQueryState({ id: "a" })).toBeUndefined();
		expect(store.peekQueryState({ id: "b" })).not.toBeUndefined();
	});

	it("does not refetch if skipRefetch is true", async () => {
		const def = { ...mockDefinition, persist: true, autoRefetch: true };

		mockFetch.mockResolvedValueOnce("initial");
		await store.executeQuery(def, { id: 1 });

		mockFetch.mockClear();
		await store.invalidateKey(
			{ id: 1 },
			{ exact: true, skipRefetch: true }
		);

		expect(mockFetch).not.toHaveBeenCalled();
	});

	it("refetches if forceRefetch is true", async () => {
		const def = { ...mockDefinition, persist: true };

		mockFetch.mockResolvedValueOnce("initial");
		await store.executeQuery(def, { id: 1 });

		mockFetch.mockResolvedValueOnce("refetched");
		await store.invalidateKey(
			{ id: 1 },
			{ exact: true, forceRefetch: true }
		);

		expect(store.peekQueryState({ id: 1 })?.data).toBe("refetched");
	});

	it("refetches if autoRefetch is true", async () => {
		const def = { ...mockDefinition, persist: true, autoRefetch: true };

		mockFetch.mockResolvedValueOnce("initial");
		await store.executeQuery(def, { id: 1 });

		mockFetch.mockResolvedValueOnce("refetched");
		await store.invalidateKey({ id: 1 }, { exact: true });

		expect(store.peekQueryState({ id: 1 })?.data).toBe("refetched");
	});

	it("calls executeQuery with undefined if params are null", async () => {
		const def = {
			...mockDefinition,
			persist: true,
			autoRefetch: true,
			key: () => "static-key",
		};

		mockFetch.mockResolvedValueOnce("initial");
		await store.executeQuery(def, null);

		// simulate invalidation
		mockFetch.mockResolvedValueOnce("refetched");

		await store.invalidateKey("static-key", { exact: true });

		expect(store.peekQueryState("static-key")?.data).toBe("refetched");
	});

	it("isAnythingLoading reflects loading state", async () => {
		let resolve: (val: any) => void;
		mockFetch.mockImplementation(
			() => new Promise((res) => (resolve = res))
		);

		const promise = store.executeQuery(mockDefinition, { id: 1 });
		expect(store.isAnythingLoading).toBe(true);

		resolve!("done");
		await promise;
		expect(store.isAnythingLoading).toBe(false);
	});

	it("checkEntryStatusAndRefresh invalidates expired non-autoRefetch entries", async () => {
		mockFetch.mockResolvedValueOnce("data");
		await store.executeQuery(mockDefinition, { id: 1 });

		// simulate expiration
		const state = store.peekQueryState({ id: 1 })!;
		state.timestamp = Date.now() - 2000;

		await store.checkEntryStatusAndRefresh();
		expect(store.peekQueryState({ id: 1 })).toBeUndefined();
	});

	it("checkEntryStatusAndRefresh refetches autoRefetch entries", async () => {
		const autoRefetchDef = { ...mockDefinition, autoRefetch: true };
		mockFetch.mockResolvedValueOnce("data");
		await store.executeQuery(autoRefetchDef, { id: 1 });

		const state = store.peekQueryState({ id: 1 })!;
		state.timestamp = Date.now() - 2000;

		mockFetch.mockResolvedValueOnce("refetched");
		await store.checkEntryStatusAndRefresh();

		expect(store.peekQueryState({ id: 1 })?.data).toBe("refetched");
	});

	it("reuses in-flight promise if already fetching", async () => {
		let resolve: (val: any) => void;
		const promise = new Promise((res) => (resolve = res));
		mockFetch.mockReturnValue(promise);

		const p1 = store.executeQuery(mockDefinition, { id: 1 });
		const p2 = store.executeQuery(mockDefinition, { id: 1 });

		expect(p1).toStrictEqual(p2);

		resolve!("done");
		await p1;
	});

	it("stores error if fetch fails and persist is true", async () => {
		const error = new Error("fail");

		const persistentDef = { ...mockDefinition, persist: true };

		// First call to initialize cache
		mockFetch.mockResolvedValueOnce("init");
		await store.executeQuery(persistentDef, { id: 1 });

		// Now simulate failure
		mockFetch.mockRejectedValueOnce(error);
		await expect(
			store.executeQuery(persistentDef, { id: 1 }, { forceRefetch: true })
		).rejects.toThrow("fail");

		const state = store.peekQueryState({ id: 1 });
		expect(state?.error).toEqual(error);
	});

	it("deletes cache on error if persist is false", async () => {
		const error = new Error("fail");
		mockFetch.mockRejectedValueOnce(error);

		const nonPersistentDef = { ...mockDefinition, persist: false };

		await expect(
			store.executeQuery(nonPersistentDef, { id: 1 })
		).rejects.toThrow("fail");

		const state = store.peekQueryState({ id: 1 });
		expect(state).toBeUndefined();
	});

	it("deletes cache if persist is false", async () => {
		const nonPersistentDef = { ...mockDefinition, persist: false };
		mockFetch.mockResolvedValueOnce("temp");

		await store.executeQuery(nonPersistentDef, { id: 1 });

		expect(store.peekQueryState({ id: 1 })).toBeUndefined();
	});
});
