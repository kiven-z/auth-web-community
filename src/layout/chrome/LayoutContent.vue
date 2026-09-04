<script lang="ts" setup>
import { resolveContentMainWidth, resolveContentSectionPaddingTop } from '@/layout/utils/content-style';
import { useDisplayPreferencesStore } from '@/store/modules/preferences/display-preferences';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { storeToRefs } from 'pinia';
import { computed, defineComponent, h, Transition } from 'vue';
import { useI18n } from 'vue-i18n';
import RocketIcon from '~icons/ri/rocket-line';
import LayoutFooter from './LayoutFooter.vue';
import MultiFrame from './MultiFrame.vue';

defineOptions({ name: 'LayoutContent' });

const { t } = useI18n();
const displayStore = useDisplayPreferencesStore();
const { hideTabs, hideFooter, stretch, showModel } = storeToRefs(displayStore);

const transitions = computed(() => (route) => route.meta.transition);
const contentStyleVars = computed(() => ({
  '--layout-content-max-width': resolveContentMainWidth(stretch.value),
  '--layout-content-padding-top': resolveContentSectionPaddingTop({
    hideTabs: hideTabs.value,
    showModel: showModel.value,
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
  overflow-x: hidden;

  :deep(.el-scrollbar__view) {
    display: flex;
    flex: auto;
    flex-direction: column;
    overflow: hidden;
  }

  :deep(.el-scrollbar__wrap) {
    display: flex;
    flex-wrap: wrap;
    max-width: var(--layout-content-max-width);
    margin: 0 auto;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.layout__content-body {
  flex-grow: 1;
}

.layout__page {
  margin: 24px;
}
</style>
