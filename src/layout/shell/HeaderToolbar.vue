<script lang="ts" setup>
import type { LocaleType } from '@/auth/config/locales';
import { UserAvatar } from '@/components/domain/user/UserProfile';
import { useTranslationLang } from '@/layout/hooks/locale/useTranslationLang';
import { useLayoutUiStore } from '@/store/modules/app/layout-ui';
import { useUserStore } from '@/store/modules/auth/user';
import { useOpenPersonalWorkspace } from '@/features/home/personal/hooks/useOpenPersonalWorkspace';
import { computed, ref, watch } from 'vue';
import { useFullscreen } from '@vueuse/core';
import LayNotice from '../components/lay-notice/index.vue';
import LaySearch from '../components/lay-search/index.vue';

import Check from '~icons/ep/check';
import TranslateIcon from '~icons/ri/translate';
import LogoutCircleRLine from '~icons/ri/logout-circle-r-line';
import Setting from '~icons/ri/settings-3-line';
import UserSettingsLine from '~icons/ri/user-settings-line';
import ExitFullscreen from '~icons/ri/fullscreen-exit-fill';
import Fullscreen from '~icons/ri/fullscreen-fill';

interface Props {
  /** 横向 el-menu 实例（模板传 ref 会自动解包） */
  menuInstance?: { handleResize?: () => void };
}

const props = defineProps<Props>();

const { openPersonalWorkspace } = useOpenPersonalWorkspace();
const layoutUiStore = useLayoutUiStore();
const userStore = useUserStore();

/** 昵称优先，否则用户名 */
const displayName = computed(() => (userStore.nickname ? userStore.nickname : userStore.username));
const primaryDeptName = computed(() => userStore.primaryDeptName ?? '');

/**
 * 退出登录并清理本地会话
 */
function logout(): void {
  userStore.logoutAndClear();
}

const { t, locale, translation: applyLocale, localeOptions } = useTranslationLang();

/**
 * 切换语言并刷新横向菜单尺寸
 * @param localeValue 目标语言
 */
function translation(localeValue: LocaleType): void {
  applyLocale(localeValue);
  props.menuInstance?.handleResize?.();
}

const screenIcon = ref();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen();

isFullscreen.value = !!(
  document.fullscreenElement ||
  (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
  (document as Document & { mozFullScreenElement?: Element }).mozFullScreenElement ||
  (document as Document & { msFullscreenElement?: Element }).msFullscreenElement
);

watch(
  isFullscreen,
  (full) => {
    screenIcon.value = full ? ExitFullscreen : Fullscreen;
  },
  { immediate: true }
);
</script>

<template>
  <LaySearch id="header-search" />
  <el-dropdown id="header-translation" trigger="click">
    <IconifyIconOffline :icon="TranslateIcon" class="navbar-bg-hover w-10 h-12 p-2.75 cursor-pointer outline-hidden" />
    <template #dropdown>
      <el-dropdown-menu class="layout-toolbar__locale-menu">
        <el-dropdown-item
          v-for="item in localeOptions"
          :key="item.locale"
          :class="['dark:text-white!', locale === item.locale ? '' : 'dark:hover:text-primary!']"
          :style="{
            background: locale === item.locale ? 'var(--el-color-primary)' : '',
            color: locale === item.locale ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)',
          }"
          @click="translation(item.locale)"
        >
          <IconifyIconOffline v-show="locale === item.locale" :icon="Check" class="layout-toolbar__check" />
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span id="full-screen" class="layout-toolbar__fullscreen navbar-bg-hover" @click="toggleFullscreen">
    <IconifyIconOffline :icon="screenIcon" />
  </span>
  <LayNotice id="header-notice" />
  <!-- 主部门：与用户下拉并列的独立展示块 -->
  <span v-if="primaryDeptName" class="layout-toolbar__dept navbar-bg-hover select-none">
    <el-text class="layout-toolbar__dept-text" type="primary">{{ primaryDeptName }}</el-text>
  </span>
  <el-dropdown trigger="click">
    <span class="el-dropdown-link navbar-bg-hover select-none">
      <UserAvatar :avatar="userStore.avatar" :name="displayName" :size="22" class="layout-toolbar__avatar" />
      <span v-if="displayName" class="dark:text-white">{{ displayName }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu class="layout-toolbar__logout-menu">
        <el-dropdown-item @click="openPersonalWorkspace('PersonalProfile')">
          <IconifyIconOffline :icon="UserSettingsLine" style="margin: 5px" />
          {{ t('personal.title') }}
        </el-dropdown-item>
        <el-dropdown-item @click="logout">
          <IconifyIconOffline :icon="LogoutCircleRLine" style="margin: 5px" />
          {{ t('buttons.loginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span
    :title="t('buttons.openSystemSet')"
    class="layout-toolbar__settings navbar-bg-hover"
    @click="layoutUiStore.openSettingsPanel()"
  >
    <IconifyIconOffline :icon="Setting" />
  </span>
</template>

<style lang="scss" scoped>
.layout-toolbar__dept {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  white-space: nowrap;

  .layout-toolbar__dept-text {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.02em;
  }
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 48px;
  padding: 10px;
  color: var(--auth-text-primary);
  cursor: pointer;

  p {
    font-size: 14px;
  }

  .layout-toolbar__avatar {
    margin-right: 10px;
  }
}

.layout-toolbar__locale-menu {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .layout-toolbar__check {
    position: absolute;
    left: 20px;
  }
}

.layout-toolbar__logout-menu {
  width: 140px;

  ::v-deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}
</style>
