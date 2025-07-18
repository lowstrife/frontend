<script setup lang="ts">
	import { computed, Ref, ref } from "vue";
	import { QueryState, useQueryStore } from "./queryStore";

	import { NTable, NButton } from "naive-ui";
	import { queryRepository } from "./queryRepository";

	// Grab the Pinia store
	const queryStore = useQueryStore();

	// Build a list of all cache entries
	const entries = computed(() => {
		return Array.from(queryStore.cache.entries()).map(([key, state]) => ({
			key,
			state: state as QueryState<unknown, unknown>,
			// Prettify JSON or show placeholder
			jsonData:
				state.data !== null
					? JSON.stringify(state.data, null, 2)
					: "null",
			expireAt: state.expireTime
				? state.timestamp + state.expireTime
				: null,
		}));
	});

	const getMaterialsDef = queryRepository.GetMaterials;
	const getMaterialsState = computed(() =>
		queryStore.peekQueryState(getMaterialsDef.key)
	);

	const getExchangesDef = queryRepository.GetExchanges;
	const getExchangesState = computed(() =>
		queryStore.peekQueryState(getExchangesDef.key)
	);

	const cloneUuid: Ref<string | null> = ref<string | null>(null);

	const cloneState = computed(() => {
		if (cloneUuid.value === null) return false;
		const def = queryRepository.ClonePlan.key({
			planUuid: cloneUuid.value,
			cloneName: "",
		});
		return queryStore.peekQueryState(def)?.loading ?? false;
	});

	async function loadMaterials() {
		try {
			await queryStore.executeQuery(getMaterialsDef);
		} catch (e) {
			console.error(e);
		}
	}
	async function loadExchanges() {
		try {
			await queryStore.executeQuery(getExchangesDef);
		} catch (e) {
			console.error(e);
		}
	}

	async function clonePlan(planUuid: string, cloneName: string) {
		try {
			await queryStore.executeQuery(queryRepository.ClonePlan, {
				planUuid,
				cloneName,
			});
		} catch (e) {
			console.error(e);
		}
	}

	const testPlanet: Ref<string> = ref("KW-688c");
</script>

<template>
	<div class="p-3">
		<div class="flex flex-row justify-between">
			<h2 class="text-2xl pb-3">Query Cache</h2>
			<div class="flex flex-row gap-x-3">
				<n-button
					:loading="
						getMaterialsState ? getMaterialsState.loading : false
					"
					@click="loadMaterials">
					Load Materials
				</n-button>
				<n-button
					:loading="
						getExchangesState ? getExchangesState.loading : false
					"
					@click="loadExchanges">
					Load Exchanges
				</n-button>
				<n-button
					:loading="cloneState"
					@click="
						clonePlan(
							'da105ce1-25f2-479d-b1eb-944353f4784f',
							'CLONE FOO'
						)
					">
					Clone Plan
				</n-button>
				<n-button
					@click="
						() => {
							testPlanet = 'OT-580b';
						}
					">
					Montem
				</n-button>
				<n-button
					@click="
						() => {
							testPlanet = 'KW-688c';
						}
					">
					Etherwind
				</n-button>
			</div>
		</div>
		<n-table class="mt-3">
			<thead>
				<tr>
					<th>Key</th>
					<th>Loading</th>
					<th>Error</th>
					<th>Timestamp</th>
					<th>ExpireMs</th>
					<th>ExpireAt</th>
					<th>AutoRefetch</th>
					<th>Data</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="entry in entries" :key="`${entry.key}`">
					<td>
						<pre>{{ entry.key }}</pre>
					</td>
					<td>
						<span v-if="entry.state.loading">⏳</span>
						<span v-else>✔️</span>
					</td>
					<td>
						<span v-if="entry.state.error">{{
							entry.state.error.message
						}}</span>
						<span v-else>—</span>
					</td>
					<td>
						<span v-if="entry.state.timestamp">
							{{
								new Date(entry.state.timestamp).toLocaleString()
							}}
						</span>
						<span v-else>—</span>
					</td>
					<td>
						<pre>{{ entry.state.expireTime }}</pre>
					</td>
					<td>
						{{
							entry.expireAt
								? new Date(entry.expireAt).toLocaleString()
								: "—"
						}}
					</td>
					<td>{{ entry.state.definition?.autoRefetch }}</td>
					<td>
						<pre>{{ entry.jsonData.length }}</pre>
					</td>
				</tr>
				<tr v-if="entries.length === 0">
					<td colspan="5">No queries in cache.</td>
				</tr>
			</tbody>
		</n-table>
	</div>
</template>
