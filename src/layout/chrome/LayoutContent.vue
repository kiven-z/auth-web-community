<script lang="ts" setup>
import { resolveContentSectionPaddingTop } from '@/layout/utils/content-style';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, h, Transition } from 'vue';
import { useI18n } from 'vue-i18n';
import RocketIcon from '~icons/ri/rocket-line';
import LayoutFooter from './LayoutFooter.vue';
import MultiFrame from './MultiFrame.vue';

defineOptions({ name: 'LayoutContent' });

const { t } = useI18n();
const displayStore = useDisplayPreferencesStore();
const layoutShellStore = useLayoutShellRuntimeStore();
const { hideTabs, hideFooter, showModel } = storeToRefs(displayStore);

const transitions = computed(() => (route) => route.meta.transition);
const contentStyleVars = computed(() => ({
  '--layout-content-padding-top': resolveContentSectionPaddingTop({
    hideTabs: hideTabs.value,
    showModel: showModel.value,
    contentFullscreen: layoutShellStore.hiddenSideBar,
  }),
}));

const transitionMain = defineComponent({
  props: {
    route: {
      type: undefined,
      required: true,
    },
  },
  render() {
    const transitionName = transitions.value(this.route)?.name || 'fade-transform';
    const enterTransition = transitions.value(this.route)?.enterTransition;
    const leaveTransition = transitions.value(this.route)?.leaveTransition;
    return h(
      Transition,
      {
        name: enterTransition ? 'auth-classes-transition' : transitionName,
        enterActiveClass: enterTransition ? `animate__animated ${enterTransition}` : undefined,
        leaveActiveClass: leaveTransition ? `animate__animated ${leaveTransition}` : undefined,
        mode: 'out-in',
        appear: true,
      },
      {
        default: () => [this.$slots.default()],
      }
    );
  },
});
</script>

<template>
  <div>
    <section :style="contentStyleVars" class="layout__content">
      <router-view>
        <template #default="{ Component, route }">
          <MultiFrame :currComp="Component" :currRoute="route">
            <template #default="{ Comp, fullPath, frameInfo }">
              <el-scrollbar>
                <el-backtop :title="t('buttons.backTop')" target=".layout__content .el-scrollbar__wrap">
                  <RocketIcon />
                </el-backtop>
                <div class="layout__content-body">
                  <transitionMain :route="route">
                    <keep-alive :include="usePermissionStore().cachePageList">
                      <component :is="Comp" :key="fullPath" :frameInfo="frameInfo" class="layout__page" />
                    </keep-alive>
                  </transitionMain>
                </div>
                <LayoutFooter v-if="!hideFooter" />
              </el-scrollbar>
            </template>
          </MultiFrame>
        </template>
      </router-view>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.layout__content {
  position: relative;
  width: 100%;
  height: 100vh;
  padding-top: var(--layout-content-padding-top);

  :deep(.el-scrollbar__view) {
    display: flex;
    flex-direction: column;
  }
}

.layout__page {
  margin: 24px;
}
</style>
