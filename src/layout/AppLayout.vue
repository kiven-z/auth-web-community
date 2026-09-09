<script lang="ts" setup>
import { setSidebarOpened } from '@/core/preferences/runtime/actions';
import { useLayoutCapabilities } from '@/layout/hooks/layout/use-layout-capabilities';
import { useBreakpointLayout } from '@/layout/hooks/use-breakpoint-layout';
import LayoutHeader from '@/layout/shell/layout-header/LayoutHeader.vue';
import LayoutSidebar from '@/layout/shell/LayoutSidebar.vue';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import 'animate.css';
import { computed, ref } from 'vue';

import LayoutContent from '@/layout/chrome/LayoutContent.vue';
import LayoutSetting from '@/layout/chrome/setting/LayoutSetting.vue';

defineOptions({
  name: 'AppLayout',
});

const { capabilities } = useLayoutCapabilities();
const layoutShellStore = useLayoutShellRuntimeStore();

const appWrapperRef = ref<HTMLDivElement>();
useBreakpointLayout(appWrapperRef);

const sidebarOpened = computed(() => layoutShellStore.sidebar.opened);
const isMobile = computed(() => layoutShellStore.device === 'mobile');
const hideSidebar = computed(() => layoutShellStore.hiddenSideBar);

const wrapperClasses = computed(() => ({
  'layout--sidebar-collapsed': !sidebarOpened.value,
  'layout--sidebar-open': sidebarOpened.value,
  'layout--no-animation': layoutShellStore.sidebar.withoutAnimation,
  'layout--mobile': isMobile.value,
}));

const showSidebar = computed(() => !hideSidebar.value && capabilities.value.showSidebar);

const showMobileMask = computed(
  () => isMobile.value && sidebarOpened.value && capabilities.value.mobileMaskUsesSidebar
);
</script>

<template>
  <div ref="appWrapperRef" :class="['layout', wrapperClasses]">
    <Transition name="layout-mask">
      <div v-if="showMobileMask" class="layout__mask" @click="setSidebarOpened()" />
    </Transition>
    <Transition name="layout-side">
      <LayoutSidebar v-if="showSidebar" />
    </Transition>
    <div :class="['layout__main', hideSidebar ? 'layout__main--hidden' : '']">
      <LayoutHeader />
      <LayoutContent />
    </div>
    <LayoutSetting />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    clear: both;
    display: table;
    content: '';
  }

  &.layout--mobile.layout--sidebar-open {
    position: fixed;
    top: 0;
  }
}

.layout__mask {
  position: absolute;
  top: 0;
  z-index: 2001;
  width: 100%;
  height: 100%;
  background: var(--auth-mask-overlay);
  opacity: 0.3;
}

.re-screen {
  margin-top: 12px;
}
</style>
