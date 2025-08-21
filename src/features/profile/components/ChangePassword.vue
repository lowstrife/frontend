<script setup lang="ts">
	import { Ref, ref } from "vue";

	// UI
	import { PForm, PFormItem, PInput, PButton } from "@/ui";

	const refCurrentPassword: Ref<string> = ref("");
	const refNewPassword: Ref<string> = ref("");
</script>

<template>
	<div>
		<div class="flex flex-row flex-wrap gap-3">
			<h2 class="flex-grow my-auto text-white/80 font-bold text-lg">
				Change Password
			</h2>
			<PButton>Change Password</PButton>
		</div>
		<div class="py-3 text-white/60">
			Passwords must be at least 8 characters long.
		</div>
		<PForm>
			<PFormItem label="Current Password">
				<PInput
					v-model:value="refCurrentPassword"
					type="password"
					class="w-full min-w-[200px] max-w-[50%]" />
			</PFormItem>
			<PFormItem label="New Password">
				<PInput
					v-model:value="refNewPassword"
					type="password"
					class="w-full min-w-[200px] max-w-[50%]" />
			</PFormItem>
		</PForm>
	</div>
</template>
