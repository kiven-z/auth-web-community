<script lang="ts" setup>
import { LOCALE_OPTIONS } from '@/core/config/localeConfig';
import { UserAvatar } from '@/components/domain/user/UserProfile';
import { useTranslationLang } from '@/shared/composables/i18n/useTranslationLang';
import { useLayoutShellRuntimeStore } from '@/store/modules/layoutShellRuntime';
import { useUserStore } from '@/store/modules/auth/user';
import { useOpenPersonalWorkspace } from '@/features/home/personal/hooks/useOpenPersonalWorkspace';
import { computed, ref, toRef, watch } from 'vue';
import { useFullscreen } from '@vueuse/core';
import NoticeBadge from '@/components/domain/message/NoticeBadge';
import MenuSearch from '@/layout/chrome/search/MenuSearch.vue';

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
const layoutShellStore = useLayoutShellRuntimeStore();
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

const { t, locale, translation } = useTranslationLang(toRef(props, 'menuInstance'));

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
  <MenuSearch id="header-search" />
  <el-dropdown id="header-translation" trigger="click">
    <IconifyIconOffline :icon="TranslateIcon" class="layout-toolbar__locale layout-toolbar__hover" />
    <template #dropdown>
      <el-dropdown-menu class="layout-toolbar__locale-menu">
        <el-dropdown-item
          v-for="item in LOCALE_OPTIONS"
          :key="item.locale"
          :class="['layout-toolbar__locale-item', locale === item.locale && 'layout-toolbar__locale-item--active']"
          @click="translation(item.locale)"
        >
          <IconifyIconOffline v-show="locale === item.locale" :icon="Check" class="layout-toolbar__check" />
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span id="full-screen" class="layout-toolbar__fullscreen layout-toolbar__hover" @click="toggleFullscreen">
    <IconifyIconOffline :icon="screenIcon" />
  </span>
  <NoticeBadge id="header-notice" @click="openPersonalWorkspace('PersonalInbox')" />
  <!-- 主部门：与用户下拉并列的独立展示块 -->
  <span v-if="primaryDeptName" class="layout-toolbar__dept layout-toolbar__hover">
    <el-text class="layout-toolbar__dept-text" type="primary">{{ primaryDeptName }}</el-text>
  </span>
  <el-dropdown trigger="click">
    <span class="layout-toolbar__user layout-toolbar__hover">
      <UserAvatar :avatar="userStore.avatar" :name="displayName" :size="22" class="layout-toolbar__avatar" />
      <span v-if="displayName" class="layout-toolbar__name">{{ displayName }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu class="layout-toolbar__logout-menu">
        <el-dropdown-item @click="openPersonalWorkspace('PersonalProfile')">
          <IconifyIconOffline :icon="UserSettingsLine" class="layout-toolbar__menu-icon" />
          {{ t('personal.title') }}
        </el-dropdown-item>
        <el-dropdown-item @click="logout">
          <IconifyIconOffline :icon="LogoutCircleRLine" class="layout-toolbar__menu-icon" />
          {{ t('buttons.loginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span
    :title="t('buttons.openSystemSet')"
    class="layout-toolbar__settings layout-toolbar__hover"
    @click="layoutShellStore.settingsPanelOpen = true"
  >
    <IconifyIconOffline :icon="Setting" />
  </span>
</template>

<style lang="scss" scoped>
.layout-toolbar__locale {
  box-sizing: border-box;
  width: 40px;
  height: 48px;
  padding: 11px;
  cursor: pointer;
  outline: none;
}

.layout-toolbar__dept {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  white-space: nowrap;
  user-select: none;
}

.layout-toolbar__dept-text {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.02em;
}

.layout-toolbar__user {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 48px;
  padding: 10px;
  color: var(--auth-text-primary);
  cursor: pointer;
  user-select: none;
}

.layout-toolbar__avatar {
  margin-right: 10px;
}

.layout-toolbar__name {
  font-size: 14px;

  html.dark & {
    color: #fff;
  }
}

.layout-toolbar__locale-menu {
  :deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  :deep(.layout-toolbar__locale-item) {
    color: var(--auth-text-primary);
  }

  :deep(.layout-toolbar__locale-item--active) {
    color: var(--auth-text-anti);
    background: var(--el-color-primary);
  }
}

html.dark .layout-toolbar__locale-menu {
  :deep(.layout-toolbar__locale-item:not(.layout-toolbar__locale-item--active)) {
    color: #fff;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  :deep(.layout-toolbar__locale-item--active) {
    color: var(--auth-text-anti);
  }
}

.layout-toolbar__check {
  position: absolute;
  left: 20px;
}

.layout-toolbar__logout-menu {
  width: 140px;

  :deep(.el-dropdown-menu__item) {
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100%;
  }
}

.layout-toolbar__menu-icon {
  margin: 5px;
}
</style>
