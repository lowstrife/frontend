<script setup lang="ts">
	import { ComputedRef, computed, Ref, ref } from "vue";

	// UI
	import { PForm, PFormItem, PInput, PButton } from "@/ui";
	import { useQuery } from "@/lib/query_cache/useQuery";
	import { useQueryRepository } from "@/lib/query_cache/queryRepository";

	const refCurrentPassword: Ref<string> = ref("");
	const refNewPassword: Ref<string> = ref("");

	const isChanging: Ref<boolean> = ref(false);
	const changeStatus: Ref<boolean | null> = ref(null);

	const canChange: ComputedRef<boolean> = computed(
		() =>
			!!(
				refCurrentPassword.value &&
				refCurrentPassword.value !== "" &&
				refNewPassword.value &&
				refNewPassword.value !== ""
			)
	);

	async function patchPassword(): Promise<void> {
		isChanging.value = true;

		await useQuery(
			useQueryRepository().repository.PatchUserChangePassword,
			{
				old: refCurrentPassword.value,
				new: refNewPassword.value,
			}
		)
			.execute()
			.then((result: boolean) => {
				changeStatus.value = result;
			})
			.finally(() => {
				isChanging.value = false;
				refCurrentPassword.value = "";
				refNewPassword.value = "";
			});
	}
</script>

<template>
	<div>
		<div class="flex flex-row flex-wrap gap-3">
			<h2 class="flex-grow my-auto text-white/80 font-bold text-lg">
				Change Password
			</h2>
			<PButton
				:disabled="!canChange"
				:loading="isChanging"
				@click="patchPassword">
				Change Password
			</PButton>
		</div>
		<div class="py-3 text-white/60">
			Passwords must be at least 8 characters long.
		</div>
		<template v-if="changeStatus !== null">
			<div
				v-if="changeStatus"
				class="mb-3 py-1 px-2 bg-prunplanner text-black">
				Password changed.
			</div>
			<div v-else class="mb-3 py-1 px-2 bg-red-600 text-black">
				Password changed failed.
			</div>
		</template>
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
