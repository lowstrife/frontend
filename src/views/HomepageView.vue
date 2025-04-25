<script setup lang="ts">
	import { ref, Ref } from "vue";

	// UI
	import { NCollapseTransition } from "naive-ui";

	// Components
	import LoginComponent from "@/features/account/components/LoginComponent.vue";

	const refShowLogin: Ref<boolean> = ref(true);
	const refShowRegistration: Ref<boolean> = ref(false);

	function toggleLogin(): void {
		refShowRegistration.value = false;
		refShowLogin.value = !refShowLogin.value;
	}

	function toggleRegistration(): void {
		refShowLogin.value = false;
		refShowRegistration.value = !refShowRegistration.value;
	}
</script>

<template>
	<div class="mx-auto w-full max-w-7xl mt-10 px-5 md:px-10 lg:px-0">
		<div
			class="flex flex-row justify-end gap-x-7 child:text-white child:text-lg child:font-light child:hover:bg-white/10 child:hover:rounded-lg child:px-3 child:py-1 child:cursor-pointer"
		>
			<div @click="toggleRegistration">Create Account</div>
			<div @click="toggleLogin">Login</div>
		</div>
	</div>
	<div>
		<n-collapse-transition :show="refShowLogin">
			<div
				class="mt-5 md:px-10 lg:px-0 bg-white/5 border-t border-b border-white/10"
			>
				<div class="mx-auto max-w-7xl py-10">
					<LoginComponent />
				</div>
			</div>
		</n-collapse-transition>
		<n-collapse-transition :show="refShowRegistration">
			<div class="max-w-7xl bg-white/5">Registration</div>
		</n-collapse-transition>
	</div>
	<div class="mx-auto w-full max-w-7xl px-5 md:px-10 lg:px-0">
		<div class="lg:my-10">
			<h2 class="text-3xl text-prunplanner font-light">
				<span class="font-bold">PRUN</span>planner
			</h2>
			<h1
				class="bg-gradient-to-b bg-clip-text pb-4 text-7xl font-extrabold leading-tight text-transparent from-white/50 to-white"
			>
				Plan your empire. <br />
				Rule Prosperous Universe.
			</h1>
			<p class="text-xl text-white/60 font-mono">
				Say goodbye to cumbersome spreadsheets and hello to seamless management
				of your in-game assets.
			</p>
		</div>
		<h1 class="pb-4 text-4xl tracking-tight text-white text-center mt-30">
			Powerful Features, Free For Everyone
		</h1>
		<p class="text-white/60 text-center text-xl mb-10">
			Streamline your planning and resource management, ensure you stay ahead in
			the galaxy.
		</p>
		<div
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-white/20 gap-[1px] child:p-10 child:hover:bg-linear-315 child:from-white/10 child:to-transparent mb-20"
		>
			<div class="bg-black">
				<div class="flex flex-col">
					<div class="text-white text-2xl font-bold mb-2">Base Simulation</div>
					<div class="text-white/60 text-lg font-mono">
						PRUNplanner lets you design and try new bases without spending
						in-game resources. It mirrors all aspects of a base, from habitation
						and production buildings to COGC programs and planet resources.
					</div>
				</div>
			</div>
			<div class="bg-black">
				<div class="flex flex-col">
					<div class="text-white text-2xl font-bold mb-2">Empire Planning</div>
					<div class="text-white/60 text-lg font-mono">
						Effortlessly organize and manage your entire empire. With
						PRUNplanner, you can plan across multiple bases and complex supply
						chains, ensuring your material flows remain on schedule and your
						empire runs smoothly.
					</div>
				</div>
			</div>
			<div class="bg-black">
				<div class="flex flex-col">
					<div class="text-white text-2xl font-bold mb-2">Game Data</div>
					<div class="text-white/60 text-lg font-mono">
						Stay ahead with up-to-date market information integrated directly
						from the game's community API (FIO). Make informed planning and
						expansion decisions based on actual markets and the best ROI.
					</div>
				</div>
			</div>
			<div class="bg-black">
				<div class="flex flex-col">
					<div class="text-white text-2xl font-bold mb-2">Burn & Repair</div>
					<div class="text-white/60 text-lg font-mono">
						Prevent shortages and bottlenecks with detailed management tools.
						PRUNplanner tracks your resources and consumables, ensuring you have
						everything you need right when you need it, keeping your operations
						seamless.
					</div>
				</div>
			</div>
			<div class="bg-black">
				<div class="flex flex-col">
					<div class="text-white text-2xl font-bold mb-2">
						Corporation Projects
					</div>
					<div class="text-white/60 text-lg font-mono">
						Coordinate corporation projects effortlessly. Allocate plans to
						specific individuals, utilize collective FIO data for inventory and
						production insights, and access comprehensive information in a
						centralized location for efficient management.
					</div>
				</div>
			</div>
			<div class="bg-black">
				<div class="flex flex-col">
					<div class="text-white text-2xl font-bold mb-2">
						A Wealth of Additional Tools
					</div>
					<div class="text-white/60 text-lg font-mono">
						Explore material prices from now to years past, know the optimal
						times for repairing production buildings, monitor expert spawn
						times, and optimize habitation buildings for minimal area or cost.
						PRUNplanner offers these features and many more.
					</div>
				</div>
			</div>
		</div>
		<h1 class="pb-4 text-4xl tracking-tight text-white text-center mt-30">
			Core Concepts
		</h1>
		<p class="text-white/60 text-center text-xl mb-10">
			PRUNplanner consists of three main components that allow you to plan and
			manage your Prosperous Universe empire.
		</p>
		<div
			class="grid grid-cols-1 lg:grid-cols-3 divide-x divide-white/20 child:p-10 mb-10"
		>
			<div>
				<div class="text-white text-2xl font-bold mb-2">Plans</div>
				<div class="text-lg font-mono text-white/60">
					Plans are the backbone of what you do in PRUNplanner. They consist of
					all buildings, productions and bonuses of a base you can put down in
					Prosperous Universe. You can create new plans by searching for the
					planet you would like to create a base for. Also, a plan should be
					assigned a CX Exchange preference, as well as be assigned to an
					Empire.
				</div>
			</div>
			<div>
				<div class="text-white text-2xl font-bold mb-2">Empires</div>
				<div class="text-lg font-mono text-white/60">
					An Empire is a collection of plans (e.g. all the bases you currently
					have settled in Prosperous Universe, or that you would like to settle,
					all interconnected together). Each empire is like a container that
					consists of multiple plans. Additionally, an exchange preference can
					be assigned to each Empire.
				</div>
			</div>
			<div class="">
				<div class="text-white text-2xl font-bold mb-2">CX</div>
				<div class="text-lg font-mono text-white/60">
					The CX Settings allow you to define market preferences for the pricing
					of materials. Each CX Exchange can be used in multiple Empires.
					However, each Empire can only have a single CX Exchange preference
					assigned to it. This ensures that prices are properly calculated for
					all individual plans that are part of the Empire.
				</div>
			</div>
		</div>
	</div>
</template>
