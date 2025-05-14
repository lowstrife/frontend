<script setup lang="ts">
	import { usePlanningStore } from "@/stores/planningStore";

	const planningStore = usePlanningStore();

	// Util
	import { formatNumber } from "@/util/numbers";

	import {
		NForm,
		NFormItem,
		NSelect,
		NInput,
		NInputNumber,
		NCheckbox,
		NTable,
		NButton,
	} from "naive-ui";

	import { SaveSharp, ChangeCircleOutlined } from "@vicons/material";

	const fakePlans = [
		{
			name: "Bober NR+PG",
			planet: "ZV-307b",
			cogc: "Chemistry",
			permits: "1",
			profit: 268001.71,
		},
		{
			name: "DEIMALO",
			planet: "ZV-759c",
			cogc: "Metallurgy",
			permits: "1",
			profit: 69961.06,
		},
		{
			name: "Demeter RCO",
			planet: "KI-446b",
			cogc: "Agriculture",
			permits: "1",
			profit: -7125.01,
		},
	];
</script>

<template>
	<div
		class="px-6 py-3 border-b border-white/10 flex flex-row justify-between gap-x-3"
	>
		<h1 class="text-2xl font-bold my-auto">PRUN REAL</h1>
		<div class="flex gap-x-3">
			<n-button size="small">Material I/O</n-button>
			<n-button size="small" secondary>Analysis</n-button>
		</div>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-[40%_auto]">
		<div>
			<div class="p-6 lg:border-r border-b border-white/10 my-auto">
				<n-form
					label-placement="left"
					label-width="auto"
					label-align="left"
					size="small"
				>
					<n-form-item label="Empire">
						<n-select :options="[{ label: 'foo', value: 'foo' }]" />
					</n-form-item>
				</n-form>
			</div>
			<div class="p-6 lg:border-r border-b border-white/10">
				<div
					class="grid grid-cols-1 lg:grid-cols-3 gap-6 child:child:text-center"
				>
					<div>
						<div class="text-white/40 text-xs">Profit</div>
						<div class="text-white text-xl">1,858,980.25 $</div>
					</div>
					<div>
						<div class="text-white/40 text-xs">Revenue</div>
						<div class="text-white text-xl">2,118,587.28 $</div>
					</div>
					<div>
						<div class="text-white/40 text-xs">Cost</div>
						<div class="text-white text-xl">259,607.03 $</div>
					</div>
				</div>
			</div>
			<div class="p-6 lg:border-r border-b border-white/10">
				<n-table striped>
					<thead>
						<tr>
							<th>Name</th>
							<th>Planet</th>
							<th>COGC</th>
							<th class="!text-center">Permits</th>
							<th class="!text-right">Profit</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="plan in fakePlans" :key="plan.name">
							<td>
								<router-link
									:to="`/plan/${plan.planet}`"
									class="text-link-primary font-bold hover:underline"
								>
									{{ plan.name }}
								</router-link>
							</td>
							<td>{{ plan.planet }}</td>
							<td>{{ plan.cogc }}</td>
							<td class="text-center">{{ plan.permits }}</td>
							<td
								class="text-right"
								:class="plan.profit >= 0 ? '!text-positive' : '!text-negative'"
							>
								{{ formatNumber(plan.profit) }}
								<span class="pl-1 font-light text-white/50">$</span>
							</td>
						</tr>
					</tbody>
				</n-table>
			</div>
			<div class="p-6 lg:border-r border-b border-white/10">
				<div class="pb-3 flex justify-between">
					<h2 class="flex-grow text-white/80 font-bold text-lg my-auto">
						Configuration
					</h2>
					<div class="flex gap-x-3">
						<n-button size="small">
							<template #icon><SaveSharp /></template>
							Save
						</n-button>
						<n-button size="small">
							<template #icon><ChangeCircleOutlined /></template>
							Reload
						</n-button>
					</div>
				</div>
				<n-form
					label-placement="left"
					label-width="auto"
					label-align="left"
					size="small"
				>
					<n-form-item label="Name">
						<n-input />
					</n-form-item>
					<n-form-item label="Faction">
						<n-select :options="[{ label: 'Moria', value: 'foo' }]" />
					</n-form-item>
					<n-form-item label="Permits Total">
						<n-input-number show-button class="w-full" />
					</n-form-item>
					<n-form-item label="Permits Used">
						<n-input-number show-button class="w-full" />
					</n-form-item>
					<n-form-item label="Use FIO Storage?">
						<n-checkbox />
					</n-form-item>
				</n-form>
			</div>
		</div>
		<div class="p-6">Meow :3</div>
	</div>
</template>
