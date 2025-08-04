<script setup lang="ts">
	import { NEmpty } from "naive-ui";
	import { HourglassEmptySharp } from "@vicons/material";
</script>

<template>
	<div class="relative w-full h-full">
		<div class="absolute inset-0 flex items-center justify-center">
			<n-empty description="Feature Not Yet Implemented">
				<template #icon>
					<HourglassEmptySharp />
				</template>
				<template #extra>
					<div>
						PRUNplanner v2 is Open Source. Check out the
						<a
							href="https://github.com/PRUNplanner/frontend"
							target="_blank"
							class="text-link-primary hover:underline">
							Github repository</a
						>.
					</div>
					<div>
						Get in touch on the
						<a
							href="https://discord.gg/2MDR5DYSfY"
							target="_blank"
							class="text-link-primary hover:underline"
							>PrUn Community Tools Discord</a
						>.
					</div>
				</template>
			</n-empty>
		</div>
	</div>
</template>
