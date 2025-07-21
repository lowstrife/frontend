<script setup lang="ts">
	import { computed } from "vue";
	import { useQueryStore } from "@/lib/query_cache/queryStore";

	import { NTable, NButton, NTag } from "naive-ui";
	import { QueryState } from "./queryCache.types";

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
</script>

<template>
	<div class="p-3">
		<div class="flex flex-row justify-between pb-3">
			<h2 class="text-2xl">Query Cache</h2>
		</div>
		<n-table>
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
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr
					v-for="entry in entries"
					:key="`${entry.key}`"
					class="child:text-nowrap">
					<td class="!text-wrap break-all">
						{{ entry.key }}
					</td>
					<td>
						<n-tag
							v-if="entry.state.loading"
							size="small"
							:bordered="false"
							type="success">
							yes
						</n-tag>
						<n-tag v-else size="small" :bordered="false">no</n-tag>
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
					<td>
						<n-tag
							v-if="entry.state.definition?.autoRefetch"
							size="small"
							:bordered="false"
							type="success">
							yes
						</n-tag>
						<n-tag
							v-else
							size="small"
							:bordered="false"
							type="error">
							no
						</n-tag>
					</td>
					<td>
						<pre>{{ entry.jsonData.length }}</pre>
					</td>
					<td>
						<n-button
							size="tiny"
							type="error"
							@click="
								async () => {
									await queryStore.invalidateKey(
										JSON.parse(entry.key),
										{ skipRefetch: true }
									);
								}
							">
							Invalidate
						</n-button>
					</td>
				</tr>
				<tr v-if="entries.length === 0">
					<td colspan="9">No queries in cache.</td>
				</tr>
			</tbody>
		</n-table>
	</div>
</template>
