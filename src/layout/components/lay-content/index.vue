<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import LayFrame from '../lay-frame/index.vue';
import LayFooter from '../lay-footer/index.vue';
import { getConfig } from '@/auth/config';
import { getUiPreferenceState } from '@/core/preferences/persistence/storage';
import { resolveLayContentMainWidth, resolveLayContentSectionStyle } from '@/layout/utils/content-style';
import RocketIcon from '~icons/ri/rocket-line';
import { computed, defineComponent, h, Transition } from 'vue';
import { usePermissionStore } from '@/store/modules/auth/permission';

defineOptions({
  name: 'LayContent',
});

const props = defineProps({
  fixedHeader: Boolean,
});

const { t } = useI18n();
const preferenceState = getUiPreferenceState();
const platformConfig = getConfig();
const showModel = computed(() => preferenceState.configure?.showModel || 'smart');

const isKeepAlive = computed(() => {
  return platformConfig?.KeepAlive;
});

const transitions = computed(() => {
  return (route) => route.meta.transition;
});

const hideTabs = computed(() => preferenceState.configure.hideTabs);
const hideFooter = computed(() => preferenceState.configure.hideFooter);
const stretch = computed(() => preferenceState.configure.stretch);
const getMainWidth = computed(() => resolveLayContentMainWidth(stretch.value));

const getSectionStyle = computed(() =>
  resolveLayContentSectionStyle({
    hideTabs: hideTabs.value,
    showModel: showModel.value,
    fixedHeader: props.fixedHeader,
  })
);

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
    <section :class="[fixedHeader ? 'layout__content' : 'layout__content--scroll']" :style="getSectionStyle">
      <router-view>
        <template #default="{ Component, route }">
          <LayFrame :currComp="Component" :currRoute="route">
            <template #default="{ Comp, fullPath, frameInfo }">
              <el-scrollbar
                v-if="fixedHeader"
                :view-style="{
                  display: 'flex',
                  flex: 'auto',
                  overflow: 'hidden',
                  'flex-direction': 'column',
                }"
                :wrap-style="{
                  display: 'flex',
                  'flex-wrap': 'wrap',
                  'max-width': getMainWidth,
                  margin: '0 auto',
                  transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                }"
              >
                <el-backtop :title="t('buttons.backTop')" target=".layout__content .el-scrollbar__wrap">
                  <IconifyIconOffline :icon="RocketIcon" />
                </el-backtop>
                <div class="grow">
                  <transitionMain :route="route">
                    <keep-alive v-if="isKeepAlive" :include="usePermissionStore().cachePageList">
                      <component :is="Comp" :key="fullPath" :frameInfo="frameInfo" class="layout__page" />
                    </keep-alive>
                    <component :is="Comp" v-else :key="fullPath" :frameInfo="frameInfo" class="layout__page" />
                  </transitionMain>
                </div>
                <LayFooter v-if="!hideFooter" />
              </el-scrollbar>
              <div v-else class="grow">
                <transitionMain :route="route">
                  <keep-alive v-if="isKeepAlive" :include="usePermissionStore().cachePageList">
                    <component :is="Comp" :key="fullPath" :frameInfo="frameInfo" class="layout__page" />
                  </keep-alive>
                  <component :is="Comp" v-else :key="fullPath" :frameInfo="frameInfo" class="layout__page" />
                </transitionMain>
              </div>
            </template>
          </LayFrame>
        </template>
      </router-view>

      <LayFooter v-if="!hideFooter && !fixedHeader" />
    </section>
  </div>
</template>

<style scoped>
.layout__content {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}

.layout__content--scroll {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.layout__page {
  margin: 24px;
}
</style>
