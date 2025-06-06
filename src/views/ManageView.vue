<script setup lang="ts">
	import { defineAsyncComponent, ref, Ref } from "vue";

	// Unhead
	import { useHead } from "@unhead/vue";
	useHead({
		title: "Management | PRUNplanner",
	});

	// Components
	import ManageDataWrapper from "@/features/wrapper/components/ManageDataWrapper.vue";
	const AsyncManagePlanEmpireAssignments = defineAsyncComponent(
		() => import("@/features/manage/components/ManagePlanEmpireAssignments.vue")
	);
	const AsyncManageCX = defineAsyncComponent(
		() => import("@/features/manage/components/ManageCX.vue")
	);
	const AsyncManageEmpire = defineAsyncComponent(
		() => import("@/features/manage/components/ManageEmpire.vue")
	);

	// Types & Interfaces
	import { ICX, IPlan, IPlanEmpireElement } from "@/stores/planningStore.types";

	const empireList: Ref<IPlanEmpireElement[]> = ref([]);
	const planList: Ref<IPlan[]> = ref([]);
	const cxList: Ref<ICX[]> = ref([]);
</script>

<template>
	<ManageDataWrapper
		v-on:update:empire-list="(empireData) => (empireList = empireData)"
		v-on:update:plan-list="(planData) => (planList = planData)"
		v-on:update:cx-list="(cxData) => (cxList = cxData)"
	>
		<div
			class="px-6 py-3 border-b border-white/10 flex flex-row justify-between gap-x-3"
		>
			<h1 class="text-2xl font-bold my-auto">Management</h1>
		</div>
		<div
			class="border-b border-white/10 grid grid-cols-1 lg:grid-cols-[60%_auto] divide-x divide-white/10 child:px-6 child:py-3"
		>
			<div>
				<AsyncManageEmpire
					:empires="empireList"
					:cx="cxList"
					v-on:update:cx-list="(cxData) => (cxList = cxData)"
					v-on:update:empire-list="(empireData) => (empireList = empireData)"
				/>
			</div>
			<div>
				<AsyncManageCX
					:cx="cxList"
					v-on:update:cx-list="(cxData) => (cxList = cxData)"
				/>
			</div>
		</div>
		<div class="px-6 pb-3 pt-4">
			<AsyncManagePlanEmpireAssignments
				:empires="empireList"
				:plans="planList"
				v-on:update:empire-list="(empireData) => (empireList = empireData)"
				v-on:update:plan-list="(planData) => (planList = planData)"
			/>
		</div>
	</ManageDataWrapper>
</template>
