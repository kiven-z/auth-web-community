<script lang="ts" setup>
import { useLayoutCapabilities } from '@/layout/hooks/layout/useLayoutCapabilities';
import HorizontalNav from '@/layout/shell/HorizontalNav.vue';
import VerticalNavbar from '@/layout/shell/VerticalNavbar.vue';
import { useLayoutShellRuntimeStore } from '@/store/modules/layoutShellRuntime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/displayPreferences';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import TagsBar from '@/layout/chrome/tags/TagsBar.vue';

const { capabilities } = useLayoutCapabilities();
const layoutShellStore = useLayoutShellRuntimeStore();
const displayStore = useDisplayPreferencesStore();
const { hideTabs } = storeToRefs(displayStore);
const showVerticalNav = computed(() => !layoutShellStore.hiddenSideBar && capabilities.value.showSideNav);
const showHorizontalNav = computed(() => !layoutShellStore.hiddenSideBar && capabilities.value.showHorizontalNav);

const headerShadowStyle = computed(() => {
  if (!(hideTabs.value && capabilities.value.showHorizontalNav)) {
    return '';
  }
  return 'box-shadow: var(--auth-shadow-1)';
});
</script>

<template>
  <div :style="headerShadowStyle" class="layout-header">
    <Transition mode="out-in" name="layout-chrome">
      <VerticalNavbar v-if="showVerticalNav" key="vertical-nav" />
      <HorizontalNav v-else-if="showHorizontalNav" key="horizontal-nav" />
    </Transition>
    <TagsBar />
  </div>
</template>
