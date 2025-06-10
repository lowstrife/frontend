<script setup lang="ts">
	import { computed, ComputedRef, PropType, ref, Ref, watch } from "vue";

	// Stores
	import { usePlanningStore } from "@/stores/planningStore";
	const planningStore = usePlanningStore();

	// API
	import { callCreateCX, callDeleteCX } from "@/features/api/cxData.api";

	// Types & Interfaces
	import { ICX } from "@/stores/planningStore.types";

	// Util
	import { inertClone } from "@/util/data";

	// UI
	import { useDialog, NForm, NFormItem, NInput, NTag, NButton } from "naive-ui";
	const dialog = useDialog();
	import { XNDataTable, XNDataTableColumn } from "@skit/x.naive-ui";
	import { ClearSharp, PlusSharp } from "@vicons/material";

	const props = defineProps({
		cx: {
			type: Array as PropType<ICX[]>,
			required: true,
		},
	});

	// Local Data & Watcher
	const localCX: Ref<ICX[]> = ref(inertClone(props.cx));

	watch(
		() => props.cx,
		(newData: ICX[]) => {
			localCX.value = inertClone(newData);
		},
		{ deep: true }
	);

	const refShowCreateCX: Ref<boolean> = ref(false);
	const refIsCreating: Ref<boolean> = ref(false);
	const refIsDeleting: Ref<string | undefined> = ref(undefined);
	const refNewCXName: Ref<string | undefined> = ref(undefined);
	const compCanCreate: ComputedRef<boolean> = computed(() => {
		if (
			refNewCXName.value &&
			refNewCXName.value !== "" &&
			refNewCXName.value.length > 0 &&
			refNewCXName.value.length <= 100
		)
			return true;
		return false;
	});

	const emit = defineEmits<{
		(e: "update:cxList", value: ICX[]): void;
	}>();

	async function createCX(): Promise<void> {
		if (compCanCreate.value) {
			refIsCreating.value = true;

			await callCreateCX(refNewCXName.value!);

			// forced reload of all CX
			emit("update:cxList", await planningStore.getAllCX(true));

			refNewCXName.value = "";
			refShowCreateCX.value = false;
			refIsCreating.value = false;
		}
	}

	function handleDeleteConfirm(cxUuid: string): void {
		dialog.warning({
			title: "Confirm CX Deletion",
			content: "Are you sure? Deleting the CX will delete all preferences.",
			positiveText: "Delete",
			negativeText: "Cancel",
			onPositiveClick: () => {
				deleteCX(cxUuid);
			},
		});
	}

	async function deleteCX(cxUuid: string): Promise<void> {
		refIsDeleting.value = cxUuid;
		const deletionResult: boolean = await callDeleteCX(cxUuid);

		if (deletionResult) {
			// forced reload of all CX
			emit("update:cxList", await planningStore.getAllCX(true));
		}

		refIsDeleting.value = undefined;
	}
</script>

<template>
	<div class="flex justify-between">
		<h2 class="text-xl font-bold my-auto">CX Configuration</h2>
		<n-button size="small" @click="refShowCreateCX = !refShowCreateCX">
			<template #icon><PlusSharp /></template>
			New CX
		</n-button>
	</div>
	<div class="py-3 text-white/60">
		Removing a CX preference will delete all its exchange and material settings.
		Assigned empires will remain unaffected, but they will no longer use the
		removed preferences. Make sure to assign a new CX preference.
	</div>
	<div
		:class="!refShowCreateCX ? 'opacity-0 overflow-hidden !h-0' : 'opacity-100'"
		class="transition-all duration-500 border-t border-b border-white/10"
	>
		<div class="flex gap-x-3 pt-3 pb-1">
			<div class="flex-grow">
				<n-form
					label-placement="left"
					label-width="auto"
					label-align="left"
					size="small"
				>
					<n-form-item label="CX Name">
						<n-input
							v-model:value="refNewCXName"
							placeholder="CX Name (max. 100 characters)"
						/>
					</n-form-item>
				</n-form>
			</div>
			<n-button
				size="small"
				:loading="refIsCreating"
				:disabled="!compCanCreate"
				@click="createCX"
			>
				Create
			</n-button>
		</div>
	</div>

	<x-n-data-table :data="localCX" striped class="pt-3">
		<x-n-data-table-column title="Name" key="name">
			<template #render-cell="{ rowData }">
				<router-link
					:to="`/cx/${rowData.uuid}`"
					class="text-link-primary font-bold hover:underline"
				>
					{{ rowData.name }}
				</router-link>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column title="Assigned to Empire?" key="uuid">
			<template #title>
				<div class="text-center">Assigned to Empire?</div>
			</template>
			<template #render-cell="{ rowData }">
				<div class="text-center">
					<n-tag
						size="small"
						:bordered="false"
						type="success"
						v-if="rowData.empires.length > 0"
					>
						Yes ({{ rowData.empires.length }})
					</n-tag>
					<n-tag size="small" :bordered="false" type="error" v-else>No</n-tag>
				</div>
			</template>
		</x-n-data-table-column>
		<x-n-data-table-column title="" key="configuration">
			<template #render-cell="{ rowData }">
				<div class="text-end">
					<n-button
						size="tiny"
						type="error"
						@click="handleDeleteConfirm(rowData.uuid)"
						:loading="refIsDeleting === rowData.uuid ? true : false"
					>
						<template #icon><ClearSharp /></template>
					</n-button>
				</div>
			</template>
		</x-n-data-table-column>
	</x-n-data-table>
</template>
