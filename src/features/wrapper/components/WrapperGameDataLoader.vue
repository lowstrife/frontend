<script setup lang="ts">
	import {
		IExchange,
		IMaterial,
		IPlanet,
	} from "@/features/api/gameData.types";
	import {
		QueryDefinition,
		queryRepository,
	} from "@/lib/query_cache/queryRepository";
	import { useQueryStore } from "@/lib/query_cache/queryStore";
	import { computed, onMounted, ref, Ref, watch, watchEffect } from "vue";

	// UI
	import { NSpin, NIcon, NTable } from "naive-ui";
	import { CheckSharp, ClearSharp } from "@vicons/material";

	// Components
	import RenderingProgress from "@/layout/components/RenderingProgress.vue";

	const props = defineProps<{
		loadMaterials?: boolean;
		loadExchanges?: boolean;
		loadPlanet?: string;
	}>();

	const emit = defineEmits<{
		(e: "allLoaded"): void;
		(e: "materialsLoaded", data: IMaterial[]): void;
		(e: "exchangesLoaded", data: IExchange[]): void;
		(e: "planetLoaded", data: IPlanet): void;
	}>();

	const queryStore = useQueryStore();

	interface loaderType<TParams, TData> {
		propKey: string;
		name: string;
		query: QueryDefinition<TParams, TData>;
		emitEvent: string;
		params?: TParams;
	}

	const loaders: [
		loaderType<void, IMaterial[]>,
		loaderType<void, IExchange[]>,
		loaderType<{ planetNaturalId: string }, IPlanet>,
	] = [
		{
			propKey: "loadMaterials",
			name: "Material Information",
			query: queryRepository.GetMaterials,
			emitEvent: "materialsLoaded",
		},
		{
			propKey: "loadExchanges",
			name: "Exchange Information",
			query: queryRepository.GetExchanges,
			emitEvent: "exchangesLoaded",
		},
		{
			propKey: "loadPlanet",
			name: `Planet '${props.loadPlanet ?? ""}'`,
			query: queryRepository.GetPlanet,
			emitEvent: "planetLoaded",
			params: { planetNaturalId: props.loadPlanet ?? "" },
		},
	];

	const loaderStates = loaders.map((loader) => {
		const propValue: string | boolean | undefined =
			props[loader.propKey as keyof typeof props];

		const shouldLoad = computed(
			() =>
				propValue !== undefined &&
				propValue !== null &&
				propValue !== false
		);

		const param = computed(() => {
			return shouldLoad.value && loader.params
				? loader.params
				: undefined;
		});

		const key = computed(() => {
			return shouldLoad.value && loader.params
				? loader.query.key(param.value as unknown as any)
				: loader.query.key();
		});

		const state = computed(() => {
			return shouldLoad.value
				? (queryStore.peekQueryState(key.value) ?? {
						data: null,
						loading: true,
						error: null,
						timestamp: 0,
					})
				: {
						data: null,
						loading: false,
						error: null,
						timestamp: 0,
					};
		});

		return {
			propKey: loader.propKey,
			loader,
			name: loader.name,
			shouldLoad,
			key,
			param,
			state,
			data: state.value.data,
		};
	});

	function triggerLoaders() {
		loaderStates.forEach(({ loader, shouldLoad, param }) => {
			if (shouldLoad) {
				queryStore.executeQuery(
					loader.query as unknown as any,
					param.value
				);
			}
		});
	}

	// emit events
	loaderStates.forEach(({ loader, state, shouldLoad }) => {
		watchEffect(() => {
			if (shouldLoad.value && state.value.data) {
				emit(
					loader.emitEvent as keyof typeof emit,
					state.value.data as any
				);
			}
		});
	});

	const hasError = computed(() => {
		return loaderStates.some(({ shouldLoad, state }) => {
			return shouldLoad.value && state.value.error;
		});
	});

	const allLoaded = computed(() => {
		return loaderStates.every(({ shouldLoad, state }) => {
			return (
				!shouldLoad.value ||
				(state.value.data && !state.value.error && !state.value.loading)
			);
		});
	});

	onMounted(() => {
		triggerLoaders();
	});

	// done flag is used to not open the wrapper again
	const done: Ref<boolean> = ref(false);

	watch(allLoaded, (value) => {
		if (value) {
			done.value = true;
			emit("allLoaded");
		}
	});

	const w = false;
</script>

<template>
	<!-- <template v-if="!done && !allLoaded"> -->
	<template v-if="!w">
		<n-table>
			<tbody>
				<tr v-for="l in loaderStates" :key="`${l.key}`">
					<td>{{ l.name }}</td>
					<td>{{ l.key }}</td>
					<td>{{ l.param }}</td>
					<td>{{ l.state.value.loading }}</td>
				</tr>
			</tbody>
		</n-table>

		<div
			class="relative w-full h-full bg-center bg-repeat"
			:class="
				!hasError
					? 'bg-[url(/images/bg_striped_prunplanner.png)]'
					: 'bg-[url(/images/bg_striped_error.png)]'
			">
			<div class="absolute inset-0 flex items-center justify-center">
				<div
					class="bg-black p-8 rounded shadow-lg text-center flex flex-col gap-y-3">
					<h1 class="text-2xl font-bold font-mono mb-3">
						Loading Data...
					</h1>
					<div
						v-for="e in loaderStates"
						:key="e.name"
						class="flex flex-row align-middle gap-x-3">
						<div class="mr-5 w-[30px]">
							<div v-if="e.state.value.loading" class="my-1">
								<n-spin :size="14" />
							</div>
							<n-icon v-else :size="20">
								<CheckSharp v-if="!e.state.value.error" />
								<ClearSharp v-else />
							</n-icon>
						</div>
						<div>{{ e.name }}</div>
					</div>
				</div>
			</div>
		</div>
	</template>
	<template v-else>
		<Suspense>
			<slot
				:loading="allLoaded"
				:error="hasError"
				:materials="
					loaderStates.find((e) => e.propKey === 'loadMaterials')
						?.data ?? undefined
				"
				:exchanges="
					loaderStates.find((e) => e.propKey === 'loadExchanges')
						?.data ?? undefined
				" />

			<template #fallback>
				<RenderingProgress />
			</template>
		</Suspense>
	</template>
</template>
