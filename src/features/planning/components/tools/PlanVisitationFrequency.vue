<script setup lang="ts">

    import { NButton } from 'naive-ui';
    import { CloseSharp } from '@vicons/material';

    const props = defineProps({
        amountBuildings: {
            type: Number,
            required: true,
        }
    });

        const emit = defineEmits<{
            (e: "close"): void;
        }>();

    await new Promise<void>(resolve => setTimeout(resolve, 2_000))

</script>

<template>

    <div class="pb-3 flex flex-row justify-between child:my-auto">
        <h2 class="text-white/80 font-bold text-lg">Visitation Frequency</h2>
        <n-button size="tiny" secondary @click="emit('close')">
            <template #icon><CloseSharp /></template>
        </n-button>
    </div>

    Meow! Got id {{ amountBuildings }}


    <br />
    <br />
    <div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</div>
    <br />
    <div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</div>
    <br />
    <div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</div>
    <br />
    <div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</div>
    <br />
    <div>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</div>
    


</template>