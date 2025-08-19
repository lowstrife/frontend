<script setup lang="ts">
	import {
		computed,
		ComputedRef,
		nextTick,
		onBeforeUnmount,
		Ref,
		ref,
		watch,
	} from "vue";
	import { currentlyOpenId } from "@/ui/stateCurrentOpen";
	import { PSelectOption } from "@/ui/ui.types";
	import { PInput, PSelectElement, PTag } from "@/ui";
	import { createPopper, Instance } from "@popperjs/core";
	import { ClearSharp } from "@vicons/material";

	const value = defineModel<Array<null | string | number | undefined>>(
		"value",
		{
			required: true,
		}
	);

	const {
		options,
		searchable = false,
		disabled = false,
		clearable = true,
		maxItems = Infinity,
	} = defineProps<{
		options: PSelectOption[];
		searchable?: boolean;
		disabled?: boolean;
		clearable?: boolean;
		maxItems?: number;
	}>();

	const open = ref(false);
	const searchString: Ref<string | null> = ref(null);

	const displayValue: ComputedRef<string[]> = computed(() => {
		const allOptions: PSelectOption[] = [];

		options.forEach((e) => {
			if (!e.children) allOptions.push(e);
			else {
				e.children.forEach((c) => allOptions.push(c));
			}
		});

		const displayOptions: string[] = [];

		allOptions.forEach((a) => {
			if (value.value.includes(a.value)) displayOptions.push(a.label);
		});

		return displayOptions;
	});

	const filteredOptions: ComputedRef<PSelectOption[]> = computed(() => {
		if (searchString.value === null || searchString.value === "")
			return options;
		else {
			return options.filter(
				(f) =>
					f.label
						.toLowerCase()
						.includes(searchString.value!.toLowerCase()) ||
					f.children?.filter((c) =>
						c.label
							.toLowerCase()
							.includes(searchString.value!.toLowerCase())
					)
			);
		}
	});

	function change(e: string | number) {
		if (
			!disabled &&
			!value.value.includes(e) &&
			value.value.length + 1 <= maxItems
		) {
			value.value.push(e);
			value.value = [...value.value];
		}
	}

	let popperInstance: Instance | null = null;
	const triggerRef = ref<HTMLElement | null>(null);
	const dropdownRef = ref<HTMLElement | null>(null);
	const componentId = `select-${Math.random().toString(36).substring(2, 9)}`;
	const dropdownPosition = ref({ top: "0px", left: "0px", width: "100px" });

	const toggleOpen = async () => {
		if (disabled) return;

		if (currentlyOpenId.value && currentlyOpenId.value !== componentId) {
			currentlyOpenId.value = componentId;
			open.value = true;
		} else {
			open.value = !open.value;
			currentlyOpenId.value = open.value ? componentId : null;
		}

		await nextTick();

		if (open.value && triggerRef.value && dropdownRef.value) {
			// Set min-width based on trigger
			const width = triggerRef.value.offsetWidth;
			dropdownRef.value.style.minWidth = `${width}px`;

			// Create Popper instance
			popperInstance = createPopper(triggerRef.value, dropdownRef.value, {
				placement: "bottom-start",
				modifiers: [
					{
						name: "offset",
						options: {
							offset: [0, 4],
						},
					},
					{
						name: "preventOverflow",
						options: {
							boundary: "viewport",
						},
					},
				],
			});
		}
	};

	function clear(): void {
		value.value = [];
	}

	function removeElement(v: string | number): void {
		if (!disabled) {
			value.value.splice(value.value.indexOf(v, 0), 1);
			value.value = [...value.value];
		}
	}

	watch(open, (val) => {
		if (!val && popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
	});

	watch(currentlyOpenId, (newId) => {
		if (newId !== componentId && open.value) open.value = false;
	});

	onBeforeUnmount(() => {
		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}

		if (currentlyOpenId.value === componentId) currentlyOpenId.value = null;
	});
</script>

<template>
	<div
		ref="triggerRef"
		v-click-outside="
			() => {
				//open = false;
			}
		"
		class="pselect-multiple leading-none">
		<label name="pselect-multiple-label">
			<div
				class="flex flex-row items-center cursor-pointer bg-white/5 py-1 text-white/80 rounded-sm px-2">
				<div class="w-full max-w-full flex-grow" @click="toggleOpen">
					<template v-if="displayValue.length > 0">
						<div class="flex w-full max-w-full flex-wrap gap-y-1">
							<PTag
								v-for="v in displayValue"
								:key="v"
								:value="v"
								type="secondary"
								@click="removeElement(v)">
								<template #icon><ClearSharp /></template>
							</PTag>
						</div>
					</template>
					<template v-else> Select Options </template>
				</div>

				<div
					v-if="clearable && value.length !== 0"
					class="text-white/60 w-[16px]"
					@click="clear">
					<ClearSharp />
				</div>
				<div class="text-white w-[16px]" @click="() => (open = false)">
					<svg
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
							d="M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z"
							fill="currentColor" />
					</svg>
				</div>
			</div>
		</label>

		<Teleport to="body">
			<div
				v-if="open"
				ref="dropdownRef"
				class="z-5000 p-1 bg-gray-900 text-white rounded-sm shadow-lg max-h-[300px] overflow-auto"
				:style="dropdownPosition">
				<div
					class="w-full flex flex-col bg-gray-900 child:py-1 child:px-2 child:hover:bg-gray-800 rounded-b-sm">
					<PInput
						v-if="searchable"
						v-model:value="searchString"
						placeholder="Search" />
					<PSelectElement
						v-for="option in filteredOptions"
						:key="option.value"
						:option="option"
						:selected-value="value"
						@click="(v) => change(v)" />

					<template v-if="filteredOptions.length === 0">
						<div class="text-center text-xs">No Results</div>
					</template>
				</div>
			</div>
		</Teleport>
	</div>
</template>
