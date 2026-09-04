<script lang="ts" setup>
import TagsBar from '@/layout/chrome/tags/TagsBar.vue';
import { useLayoutCapabilities } from '@/layout/hooks/layout/use-layout-capabilities';
import HorizontalNavbar from '@/layout/shell/layout-header/components/HorizontalNavbar.vue';
import LayoutNavbar from '@/layout/shell/layout-header/components/LayoutNavbar.vue';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const { capabilities } = useLayoutCapabilities();
const layoutShellStore = useLayoutShellRuntimeStore();
const displayStore = useDisplayPreferencesStore();
const { hideTabs } = storeToRefs(displayStore);
const showNavbar = computed(() => !layoutShellStore.hiddenSideBar && capabilities.value.showSidebar);
const showHorizontalNavbar = computed(() => !layoutShellStore.hiddenSideBar && capabilities.value.showHorizontalNavbar);

const headerShadowStyle = computed(() => {
  if (!(hideTabs.value && capabilities.value.showHorizontalNavbar)) {
    return '';
  }
  return 'box-shadow: var(--auth-shadow-1)';
});
</script>

<template>
  <div :style="headerShadowStyle" class="layout-header">
    <Transition mode="out-in" name="layout-chrome">
      <LayoutNavbar v-if="showNavbar" key="vertical-nav" />
      <HorizontalNavbar v-else-if="showHorizontalNavbar" key="horizontal-nav" />
    </Transition>
    <TagsBar />
  </div>
</template>
