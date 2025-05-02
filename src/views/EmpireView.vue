<script setup lang="ts">
	import {
		NCard,
		NForm,
		NCheckbox,
		NFormItem,
		NInput,
		NInputNumber,
		NSelect,
		NTable,
		NButton,
		NIcon,
	} from "naive-ui";

	import {
		CheckSharp,
		RadioButtonUncheckedSharp,
		AutoAwesomeMosaicOutlined,
		AutoAwesomeMosaicFilled,
	} from "@vicons/material";

	import { ref, type Ref } from "vue";

	// Components
	import MaterialTile from "@/features/material_tile/components/MaterialTile.vue";

	const refPlanName: Ref<string> = ref("My awesome plan");
	const refNumber: Ref<number> = ref(0);
	const refBoolan: Ref<boolean> = ref(false);

	const refVisualShowConfiguration: Ref<boolean> = ref(true);

	interface IMaterial {
		name: string;
		in: number;
		out: number;
		money: number;
	}

	const materialIO: IMaterial[] = [
		{
			name: "ALE",
			in: 4.9,
			out: 0,
			money: -6848.72,
		},
		{
			name: "C",
			in: 45.86,
			out: 0,
			money: -6848.72,
		},
		{
			name: "COF",
			in: 0.5,
			out: 0,
			money: -458.1,
		},
		{
			name: "EPO",
			in: 702.19,
			out: 0,
			money: -66.707,
		},
		{
			name: "H",
			in: 45.86,
			out: 0,
			money: -5205.23,
		},
		{
			name: "NCS",
			in: 1053.28,
			out: 0,
			money: -9479.53,
		},
		{
			name: "NR",
			in: 0,
			out: 702.19,
			money: 297742.56,
		},
		{
			name: "PG",
			in: 0,
			out: 2292.86,
			money: 111396.67,
		},
		{
			name: "ABH",
			in: 0,
			out: 0,
			money: 0,
		},
		{
			name: "HMS",
			in: 0,
			out: 0,
			money: 0,
		},
		{
			name: "DW",
			in: 0,
			out: 0,
			money: 0,
		},
		{
			name: "RAT",
			in: 0,
			out: 0,
			money: 0,
		},
	];
</script>

<template>
	<div
		class="h-screen grid grid-cols-1 gap-y-6"
		:class="refVisualShowConfiguration ? 'lg:grid-cols-[300px_auto]' : ''"
	>
		<div
			class="border-r border-white/10"
			:class="!refVisualShowConfiguration ? 'hidden' : 'visible'"
		>
			<div class="p-6">
				<h2 class="text-white/80 font-bold text-lg pb-3">Configuration</h2>
				<n-form
					label-placement="left"
					label-width="auto"
					label-align="left"
					size="small"
				>
					<n-form-item label="Name">
						<n-input v-model:value="refPlanName" placeholder="Plan Name" />
					</n-form-item>
					<n-form-item label="Empire">
						<n-select
							:options="[{ label: 'My Empire' }, { label: 'My 2nd Empire' }]"
						/>
					</n-form-item>
				</n-form>
			</div>

			<div class="p-6">
				<h2 class="text-white/80 font-bold text-lg pb-3">Infrastructure</h2>
				<n-form
					label-placement="left"
					label-width="auto"
					label-align="left"
					size="small"
				>
					<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
						<n-form-item label="HB1">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HBB">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HB2">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HBC">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HB3">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HBM">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HB4">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HBL">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="HB5">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
						<n-form-item label="STO">
							<n-input-number v-model:value="refNumber" class="w-full" />
						</n-form-item>
					</div>
				</n-form>
			</div>
			<div class="p-6">
				<h2 class="text-white/80 font-bold text-lg pb-3">Bonuses</h2>
				<n-form
					label-placement="left"
					label-width="auto"
					label-align="left"
					size="small"
				>
					<n-form-item label="Coporation HQ">
						<n-checkbox v-model:checked="refBoolan" />
					</n-form-item>
					<n-form-item label="COGC">
						<n-select
							:options="[{ label: 'Chemistry' }, { label: 'Electronics' }]"
						/>
					</n-form-item>
				</n-form>
			</div>
			<div class="p-6">
				<h2 class="text-white/80 font-bold text-lg pb-3">Experts</h2>
				<div
					class="grid grid-cols-1 lg:grid-cols-[auto_auto_auto] gap-3 child:my-auto child:text-nowrap"
				>
					<div>Agriculture</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Chemistry</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>28.50 %</div>
					<div>Construction</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Electronics</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Food Industries</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Fuel Refining</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Manufacturing</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Metallurgy</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
					<div>Resource Extraction</div>
					<n-input-number
						v-model:value="refNumber"
						size="small"
						class="w-full"
					/>
					<div>0.00 %</div>
				</div>
			</div>
		</div>
		<div class="">
			<div class="border-b border-white/10 p-6">
				<div class="flex flex-row">
					<div class="my-auto pr-6">
						<n-icon
							size="24"
							@click="refVisualShowConfiguration = !refVisualShowConfiguration"
						>
							<AutoAwesomeMosaicFilled v-if="!refVisualShowConfiguration" />
							<AutoAwesomeMosaicOutlined v-else />
						</n-icon>
					</div>
					<div>
						<h1 class="text-2xl font-bold text-white">Bober</h1>
						<span class="text-white/60">ZV-307b</span>
					</div>
					<div class="flex-grow my-auto">
						<div class="flex justify-end gap-x-3">
							<n-button type="success" size="small">Saved</n-button>
							<n-button size="small">Share</n-button>
							<n-button size="small">Reload</n-button>
						</div>
					</div>
				</div>
			</div>
			<div class="border-b border-white/10 px-6 py-3 flex">
				<div class="flex-grow text-end my-auto pr-6 font-bold">Tools</div>
				<div class="flex justify-end gap-x-3">
					<n-button size="small" secondary>Empire Override</n-button>
					<n-button size="small" secondary>POPR</n-button>
					<n-button size="small" secondary>Visitation Frequency</n-button>
					<n-button size="small" secondary>Construction Cart</n-button>
					<n-button size="small" secondary>Supply Cart</n-button>
					<n-button size="small" secondary>Repair Analysis</n-button>
					<n-button size="small" secondary>Habitation Optimization</n-button>
				</div>
			</div>
			<div class="p-6 grid grid-cols-1 lg:grid-cols-[auto_450px] gap-6">
				<div class="grid grid-cols-1 2xl:grid-cols-[60%_auto] gap-6">
					<div>
						<n-card title="Workforce">
							<n-table striped>
								<thead>
									<tr>
										<th>Type</th>
										<th>Required</th>
										<th>Capacity</th>
										<th>Left</th>
										<th>Lux 1</th>
										<th>Lux 2</th>
										<th>Efficiency</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>Pioneer</td>
										<td>100</td>
										<td>100</td>
										<td>0</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>
											<n-button size="tiny" type="error">
												<template #icon>
													<n-icon>
														<RadioButtonUncheckedSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>100.00 %</td>
									</tr>
									<tr>
										<td>Settler</td>
										<td>390</td>
										<td>400</td>
										<td>10</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>100.00 %</td>
									</tr>
									<tr>
										<td>Technician</td>
										<td>490</td>
										<td>500</td>
										<td>10</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>100.00 %</td>
									</tr>
									<tr>
										<td>Engineer</td>
										<td>0</td>
										<td>0</td>
										<td>0</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>100.00 %</td>
									</tr>
									<tr>
										<td>Scientist</td>
										<td>0</td>
										<td>0</td>
										<td>0</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>
											<n-button size="tiny" type="success">
												<template #icon>
													<n-icon>
														<CheckSharp />
													</n-icon>
												</template>
											</n-button>
										</td>
										<td>100.00 %</td>
									</tr>
								</tbody>
							</n-table>
						</n-card>
					</div>
					<div>
						<n-card title="Overview"></n-card>
					</div>
				</div>
				<div class="">
					<h2 class="text-white/80 font-bold text-lg pb-3">Material I/O</h2>
					<n-table striped>
						<thead>
							<tr>
								<th></th>
								<th>Input</th>
								<th>Output</th>
								<th>Δ</th>
								<th>$ / day</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="material in materialIO" :key="material.name">
								<td>
									<MaterialTile :ticker="material.name" :amount="material.in" />
								</td>
								<td :class="material.in === 0 ? '!text-white/20' : ''">
									{{ material.in }}
								</td>
								<td :class="material.out === 0 ? '!text-white/20' : ''">
									{{ material.out }}
								</td>
								<td
									:class="
										material.out - material.in > 0
											? '!text-positive'
											: '!text-negative'
									"
								>
									{{ material.out - material.in }}
								</td>
								<td class="!text-negative">{{ material.money }}</td>
							</tr>
						</tbody>
					</n-table>
				</div>
			</div>
		</div>
	</div>
</template>
