<script setup lang="ts">
	import { PropType, ref, Ref, watch } from "vue";

	import { useQuery } from "@/lib/query_cache/useQuery";
	import { useQueryRepository } from "@/lib/query_cache/queryRepository";

	// Util
	import { inertClone } from "@/util/data";

	// Types & Interfaces
	import {
		IPlanEmpireElement,
		PLAN_FACTION,
	} from "@/stores/planningStore.types";
	import { IEmpirePatchPayload } from "@/features/empire/empire.types";
	import { SelectMixedOption } from "naive-ui/es/select/src/interface";

	// UI
	import {
		NForm,
		NFormItem,
		NInput,
		NSelect,
		NInputNumber,
		NCheckbox,
		NButton,
	} from "naive-ui";
	import { SaveSharp, ChangeCircleOutlined } from "@vicons/material";

	const props = defineProps({
		data: {
			type: Object as PropType<IPlanEmpireElement>,
			required: true,
		},
	});

	const emit = defineEmits<{
		(e: "reload:empires"): void;
	}>();

	// Local Data & Watcher
	const localData: Ref<IPlanEmpireElement> = ref(inertClone(props.data));

	watch(
		() => props.data,
		(newData: IPlanEmpireElement) =>
			(localData.value = inertClone(newData)),
		{ deep: true }
	);

	const factionOptions: SelectMixedOption[] = [
		{ label: "No Faction", value: "NONE" },
		{ label: "Antares", value: "ANTARES" },
		{ label: "Benten", value: "BENTEN" },
		{ label: "Hortus", value: "HORTUS" },
		{ label: "Moria", value: "MORIA" },
		{ label: "Outside Region", value: "OUTSIDEREGION" },
	];

	/**
	 * Reloads data from props again
	 * @author jplacht
	 *
	 * @returns {void}
	 */
	function reload(): void {
		localData.value = inertClone(props.data);
	}

	/**
	 * Persists data against backend api, triggers reload emit
	 * @author jplacht
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async function save(): Promise<void> {
		const patchData: IEmpirePatchPayload = {
			faction: localData.value.faction as PLAN_FACTION,
			permits_used: localData.value.permits_used,
			permits_total: localData.value.permits_total,
			name: localData.value.name,
			use_fio_storage: localData.value.use_fio_storage,
		};

		try {
			await useQuery(useQueryRepository().repository.PatchEmpire, {
				empireUuid: localData.value.uuid,
				data: patchData,
			}).execute();
			emit("reload:empires");
		} catch (err) {
			console.error("Error patching empire", err);
		}
	}
</script>

<template>
	<div class="pb-3 flex justify-between">
		<h2 class="flex-grow text-white/80 font-bold text-lg my-auto">
			Configuration
		</h2>

		<div class="flex gap-x-3">
			<n-button size="small" @click="save">
				<template #icon><SaveSharp /></template>
				Save
			</n-button>
			<n-button size="small" @click="reload">
				<template #icon><ChangeCircleOutlined /></template>
				Reload
			</n-button>
		</div>
	</div>
	<n-form
		label-placement="left"
		label-width="auto"
		label-align="left"
		size="small">
		<n-form-item label="Name">
			<n-input v-model:value="localData.name" />
		</n-form-item>
		<n-form-item label="Faction">
			<n-select
				v-model:value="localData.faction"
				:options="factionOptions" />
		</n-form-item>
		<n-form-item label="Permits Total">
			<n-input-number
				v-model:value="localData.permits_total"
				show-button
				:min="2"
				class="w-full" />
		</n-form-item>
		<n-form-item label="Permits Used">
			<n-input-number
				v-model:value="localData.permits_used"
				show-button
				:min="1"
				class="w-full" />
		</n-form-item>
		<n-form-item label="Use FIO Storage?">
			<n-checkbox v-model:checked="localData.use_fio_storage" />
		</n-form-item>
	</n-form>
</template>
