import { computed } from "vue";
import { QueryDefinition } from "./queryRepository";
import { useQueryStore } from "./queryStore";

export function useQuery<TParam, TData>(
	fnDef: QueryDefinition<TParam, TData>,
	params?: TParam
) {
	const queryStore = useQueryStore();

	const state = computed(() => queryStore.peekQueryState(fnDef.key(params)));

	async function execute(): Promise<TData> {
		return await queryStore.executeQuery(fnDef, params);
	}

	return {
		state: state.value,
		loading: state.value?.loading ?? false,
		error: state.value?.error !== null,
		data: (state.value?.data as unknown as TData) ?? null,
		//
		execute,
	};
}
