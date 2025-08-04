<script setup lang="ts">
	import { ref, Ref } from "vue";
	import { useUserStore } from "@/stores/userStore";
	const userStore = useUserStore();
	// UI
	import {
		NForm,
		NFormItem,
		NInput,
		NButton,
		FormInst,
		FormRules,
		FormValidationError,
	} from "naive-ui";
	import router from "@/router";

	interface ILoginForm {
		username: string | null;
		password: string | null;
	}

	const formRef = ref<FormInst | null>(null);
	const loginModel: Ref<ILoginForm> = ref({
		username: null,
		password: null,
	});

	const formRules: FormRules = {
		username: [
			{
				required: true,
				trigger: ["input"],
				message: "Username is required.",
			},
		],
		password: [
			{
				required: true,
				trigger: ["input"],
				message: "Password is required.",
			},
		],
	};

	const isLoggingIn: Ref<boolean> = ref(false);

	function handleLoginButtonClick(): void {
		isLoggingIn.value = true;

		formRef.value
			?.validate((errors: Array<FormValidationError> | undefined) => {
				if (!errors) {
					if (
						loginModel.value.username &&
						loginModel.value.password
					) {
						userStore
							.performLogin(
								loginModel.value.username,
								loginModel.value.password
							)
							.then(() => {
								isLoggingIn.value = false;
								router.push({ path: "/empire" });
							});
					}
				} else {
					console.error("nah");
					isLoggingIn.value = false;
				}
			})
			// https://github.com/tusen-ai/naive-ui/issues/6502
			.catch((err) => err);
	}
</script>

<template>
	<div class="mx-auto max-w-[400px]">
		<div class="text-xl text-white font-bold font-mono pb-3">Login</div>
		<n-form
			ref="formRef"
			size="small"
			:model="loginModel"
			:rules="formRules">
			<n-form-item path="username" label="Username">
				<n-input
					v-model:value="loginModel.username"
					placeholder=""
					@keydown.enter.prevent />
			</n-form-item>
			<n-form-item path="password" label="Password">
				<n-input
					v-model:value="loginModel.password"
					placeholder=""
					type="password"
					show-password-on="click"
					@keydown.enter.prevent />
			</n-form-item>
			<n-form-item>
				<n-button
					:loading="isLoggingIn"
					@click="handleLoginButtonClick">
					Login
				</n-button>
			</n-form-item>
		</n-form>
	</div>
</template>
