<script lang="ts" setup>
import { provide } from 'vue';
import { OVERLAY_CONFIRM_KEY } from './overlay-confirm';

const props = defineProps<{
  confirm: () => void;
  enabled?: boolean;
}>();

if (props.enabled !== false) {
  provide(OVERLAY_CONFIRM_KEY, props.confirm);
}
</script>

<template>
  <slot />
</template>
