<script setup lang="ts">
	import { defineAsyncComponent } from "vue";

	// Components
	import PlanningDataWrapper from "@/features/wrapper/components/PlanningDataWrapper.vue";
	const AsyncGameDataWrapper = defineAsyncComponent(
		() => import("@/features/wrapper/components/GameDataWrapper.vue")
	);

	// Views
	const AsyncPlanView = defineAsyncComponent(
		() => import("@/views/PlanView.vue")
	);

	const props = defineProps({
		planetNaturalId: {
			type: String,
			required: false,
		},
		planUuid: {
			type: String,
			required: false,
		},
		sharedPlanUuid: {
			type: String,
			required: false,
		},
	});

	const loadCX: boolean = props.sharedPlanUuid === undefined ? true : false;
</script>

<template>
	<PlanningDataWrapper
		:planet-natural-id="planetNaturalId"
		:plan-uuid="planUuid"
		:shared-plan-uuid="sharedPlanUuid"
		:load-c-x-data="loadCX"
	>
		<template #default="{ planDefintion, empireList, disabled }">
			<AsyncGameDataWrapper
				v-if="planDefintion != null && empireList != null"
				load-materials
				load-exchanges
				load-recipes
				load-buildings
			>
				<AsyncPlanView
					:disabled="disabled"
					:plan-data="planDefintion"
					:empire-list="empireList"
				/>
			</AsyncGameDataWrapper>
			<template v-else> Rendering </template>
		</template>
	</PlanningDataWrapper>
</template>
