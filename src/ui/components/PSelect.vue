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
	import { PSelectOption } from "@/ui/ui.types";
	import { PInput } from "@/ui";
	import { createPopper, Instance } from "@popperjs/core";

	const value = defineModel<null | string | number | undefined>("value", {
		required: true,
	});

	const {
		options,
		searchable = false,
		disabled = false,
	} = defineProps<{
		options: PSelectOption[];
		searchable?: boolean;
		disabled?: boolean;
	}>();

	const open = ref(false);
	const searchString: Ref<string | null> = ref(null);
	let popperInstance: Instance | null = null;

	const displayValue: ComputedRef<string> = computed(() => {
		const allOptions: PSelectOption[] = [];

		options.forEach((e) => {
			if (!e.children) allOptions.push(e);
			else {
				e.children.forEach((c) => allOptions.push(c));
			}
		});

		return (
			allOptions.find((f) => f.value === value.value)?.label ??
			"Please Select"
		);
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

	const useSearch: Ref<boolean> = ref(false);

	function change(e: string | number) {
		if (!disabled) {
			value.value = e;
		}
		useSearch.value = false;
	}

	const triggerRef = ref<HTMLElement | null>(null);
	const dropdownRef = ref<HTMLElement | null>(null);
	const dropdownPosition = ref({ top: "0px", left: "0px", width: "100px" });

	const toggleOpen = async () => {
		if (!disabled) {
			open.value = !open.value;

			await nextTick();

			if (open.value && triggerRef.value && dropdownRef.value) {
				// Set min-width based on trigger
				const width = triggerRef.value.offsetWidth;
				dropdownRef.value.style.minWidth = `${width}px`;

				// Create Popper instance
				popperInstance = createPopper(
					triggerRef.value,
					dropdownRef.value,
					{
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
					}
				);
			}
		}
	};

	watch(open, (val) => {
		if (!val && popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
	});

	onBeforeUnmount(() => {
		if (popperInstance) {
			popperInstance.destroy();
			popperInstance = null;
		}
	});
</script>

<template>
	<div
		ref="triggerRef"
		v-click-outside="
			() => {
				open = false;
			}
		"
		class="pselect">
		<label name="pselect">
			<div
				class="flex flex-row items-center cursor-pointer bg-white/5 text-white/80 rounded-sm px-2"
				:class="!useSearch ? 'py-1 ' : ''"
				@click="
					() => {
						toggleOpen();
						searchable ? (useSearch = true) : {};
					}
				">
				<div v-if="!useSearch" class="flex-grow px-2">
					{{ displayValue }}
				</div>
				<div
					v-else
					class="flex-grow child:child:!bg-transparent py-0.5">
					<PInput v-model:value="searchString" placeholder="Search" />
				</div>
				<div class="text-white w-[16px]">
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
				class="z-50 p-1 bg-gray-900 text-white rounded-sm shadow-lg max-h-[300px] overflow-auto"
				:style="dropdownPosition">
				<div
					class="w-full flex flex-col bg-gray-900 child:py-1 child:px-2 child:hover:bg-gray-800 rounded-b-sm">
					<template
						v-for="option in filteredOptions"
						:key="option.value">
						<template v-if="option.children">
							<template
								v-for="child in option.children"
								:key="`${option.value}#${child.value}`">
								<div
									class="flex flex-row items-center"
									@click="change(child.value)">
									<div class="pl-3 flex-grow">
										{{ child.label }}
									</div>
									<div
										v-if="child.value === value"
										class="text-white fill-white h-[16px] w-[16px]">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 16 16">
											<g fill="none">
												<path
													d="M14.046 3.486a.75.75 0
												0 1-.032 1.06l-7.93 7.474a.85.85
												0 0
												1-1.188-.022l-2.68-2.72a.75.75 0
												1 1 1.068-1.053l2.234
												2.267l7.468-7.038a.75.75 0 0 1
												1.06.032z"
													fill="currentColor" />
											</g>
										</svg>
									</div>
								</div>
							</template>
						</template>
						<template v-else>
							<div
								class="flex flex-row items-center"
								@click="change(option.value)">
								<div class="flex-grow">{{ option.label }}</div>
								<div
									v-if="option.value === value"
									class="text-white fill-white h-[16px] w-[16px]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16">
										<g fill="none">
											<path
												d="M14.046 3.486a.75.75 0 0 1-.032 1.06l-7.93 7.474a.85.85 0 0 1-1.188-.022l-2.68-2.72a.75.75 0 1 1 1.068-1.053l2.234 2.267l7.468-7.038a.75.75 0 0 1 1.06.032z"
												fill="currentColor" />
										</g>
									</svg>
								</div>
							</div>
						</template>
					</template>

					<template v-if="filteredOptions.length === 0">
						<div class="text-center text-xs">No Results</div>
					</template>
				</div>
			</div>
		</Teleport>
	</div>
</template>
