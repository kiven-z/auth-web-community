<script lang="ts" setup>
import { computed } from 'vue';
import { isUrl } from '@/shared/utils/url/url';
import type { SidebarMenuNode } from '@/layout/types';

const props = defineProps<{
  to: SidebarMenuNode;
}>();

const isExternalLink = computed(() => isUrl(props.to.name));
const getLinkProps = (item: SidebarMenuNode) => {
  if (isExternalLink.value) {
    return {
      href: item.name,
      target: '_blank',
      rel: 'noopener',
    };
  }
  return {
    to: item,
  };
};
</script>

<template>
  <component :is="isExternalLink ? 'a' : 'router-link'" v-bind="getLinkProps(to)">
    <slot />
  </component>
</template>
