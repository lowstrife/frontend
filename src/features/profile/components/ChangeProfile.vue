<script setup lang="ts">
	import { reactive, watch, Ref, ref } from "vue";

	// API
	import { useQuery } from "@/lib/query_cache/useQuery";
	import { useQueryRepository } from "@/lib/query_cache/queryRepository";

	// Stores
	import { useUserStore } from "@/stores/userStore";

	// UI
	import { PForm, PFormItem, PInput, PButton, PCheckbox } from "@/ui";

	const userStore = useUserStore();

	// local profile copy
	const localProfile = reactive({ ...userStore.profile });
	const isUpdating: Ref<boolean> = ref(false);
	const wasSaved: Ref<boolean> = ref(true);

	watch(
		() => userStore.profile,
		(newProfile) => Object.assign(localProfile, newProfile)
	);

	watch(
		() => localProfile,
		() => (wasSaved.value = false),
		{ deep: true }
	);

	async function patchProfile(): Promise<void> {
		isUpdating.value = true;

		try {
			await useQuery(useQueryRepository().repository.PatchUserProfile, {
				fio_apikey: localProfile.fio_apikey?.replace(/ /g, "") ?? null,
				prun_username: localProfile.prun_username ?? null,
				email: localProfile.email ?? null,
			}).execute();

			wasSaved.value = true;
		} catch (err) {
			console.error("Error patching user profile", err);
		} finally {
			isUpdating.value = false;
		}
	}
</script>

<template>
	<div>
		<div class="flex flex-row flex-wrap gap-3">
			<h2 class="flex-grow my-auto text-white/80 font-bold text-lg">
				Profile
			</h2>
			<PButton
				:loading="isUpdating"
				:type="wasSaved ? 'primary' : 'error'"
				@click="patchProfile">
				Update Profile
			</PButton>
		</div>
		<div class="py-3 text-white/60">
			FIO Data Updates are handled by PRUNplanners backend automatically.
			It is not required to provide an email but highly recommended for
			increased account safety and password recovery.
		</div>
		<PForm v-if="localProfile">
			<PFormItem label="FIO API Key">
				<PInput
					v-model:value="localProfile.fio_apikey"
					class="w-full min-w-[200px] max-w-[50%]" />
			</PFormItem>
			<PFormItem label="PrUn Username">
				<PInput
					v-model:value="localProfile.prun_username"
					class="w-full min-w-[200px] max-w-[50%]" />
			</PFormItem>
			<PFormItem label="Email Address">
				<PInput
					v-model:value="localProfile.email"
					class="w-full min-w-[200px] max-w-[50%]" />
			</PFormItem>
			<PFormItem label="Email Verified">
				<PCheckbox
					v-model:checked="localProfile.email_verified"
					disabled />
			</PFormItem>
		</PForm>
	</div>
</template>
