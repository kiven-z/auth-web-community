<script lang="ts" setup>
import { useLayoutCapabilities } from '@/layout/hooks/layout/useLayoutCapabilities';
import HorizontalNav from '@/layout/shell/HorizontalNav.vue';
import VerticalNavbar from '@/layout/shell/VerticalNavbar.vue';
import { getUiPreferenceState } from '@/core/preferences/persistence/storage';
import { useSettingStore } from '@/store/modules/app/settings';
import { computed } from 'vue';
import LayTag from '../components/lay-tag/index.vue';

const { capabilities } = useLayoutCapabilities();
const settingStore = useSettingStore();
const preferenceState = getUiPreferenceState();

const fixedHeader = computed(() => settingStore.fixedHeader);
const hideTabs = computed(() => preferenceState.configure.hideTabs);
const showVerticalNav = computed(() => !settingStore.hiddenSideBar && capabilities.value.showSideNav);
const showHorizontalNav = computed(() => !settingStore.hiddenSideBar && capabilities.value.showHorizontalNav);

const headerShadowStyle = computed(() => {
  if (!(hideTabs.value && capabilities.value.showHorizontalNav)) {
    return '';
  }
  return 'box-shadow: var(--auth-shadow-1)';
});

const headerClass = computed(() => ['layout-header', { 'layout-header--fixed': fixedHeader.value }]);
</script>

<template>
  <div :class="headerClass" :style="headerShadowStyle">
    <Transition mode="out-in" name="layout-chrome">
      <VerticalNavbar v-if="showVerticalNav" key="vertical-nav" />
      <HorizontalNav v-else-if="showHorizontalNav" key="horizontal-nav" />
    </Transition>
    <LayTag />
  </div>
</template>
