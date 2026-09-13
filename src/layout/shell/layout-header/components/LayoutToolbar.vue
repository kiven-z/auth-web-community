<script lang="ts" setup>
import NoticeBadge from '@/components/domain/message/notice-badge';
import { UserAvatar } from '@/components/domain/user/user-profile';
import { LOCALE_OPTIONS } from '@/core/config/locale-config';
import { useOpenPersonalWorkspace } from '@/features/home/personal/hooks/use-open-personal-workspace';
import MenuSearch from '@/layout/chrome/search/MenuSearch.vue';
import { useTranslationLang } from '@/shared/composables/i18n/use-translation-lang';
import { useUserStore } from '@/store/modules/auth/user';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useFullscreen } from '@vueuse/core';
import { computed, ref, toRef, watch } from 'vue';

import ExitFullscreen from '~icons/ri/fullscreen-exit-line';
import Fullscreen from '~icons/ri/fullscreen-line';
import LogoutCircleRLine from '~icons/ri/logout-circle-r-line';
import Setting from '~icons/ri/settings-3-line';
import TranslateIcon from '~icons/ri/translate';
import UserSettingsLine from '~icons/ri/user-settings-line';

interface Props {
  /** 横向 el-menu 实例（模板传 ref 会自动解包） */
  menuInstance?: { handleResize?: () => void };
}

const props = defineProps<Props>();

const { openPersonalWorkspace } = useOpenPersonalWorkspace();
const layoutShellStore = useLayoutShellRuntimeStore();
const userStore = useUserStore();

/** 昵称优先，否则用户名 */
const displayName = computed(() => userStore.nickname || userStore.username);
const primaryDeptName = computed(() => userStore.primaryDeptName ?? '');

const { t, translation } = useTranslationLang(toRef(props, 'menuInstance'));

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
    <span class="layout-toolbar__item">
      <TranslateIcon />
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in LOCALE_OPTIONS" :key="item.locale" @click="translation(item.locale)">
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span id="full-screen" class="layout-toolbar__item" @click="toggleFullscreen">
    <component :is="screenIcon" />
  </span>
  <NoticeBadge id="header-notice" @click="openPersonalWorkspace('PersonalInbox')" />
  <span v-if="primaryDeptName" class="layout-toolbar__dept">
    <el-text type="primary">{{ primaryDeptName }}</el-text>
  </span>
  <el-dropdown trigger="click">
    <span class="layout-toolbar__user">
      <UserAvatar :avatar="userStore.avatar" :name="displayName" :size="22" />
      <span v-if="displayName">{{ displayName }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openPersonalWorkspace('PersonalProfile')">
          <el-icon><UserSettingsLine /></el-icon>
          {{ t('personal.title') }}
        </el-dropdown-item>

        <el-dropdown-item @click="userStore.logoutAndClear()">
          <el-icon><LogoutCircleRLine /></el-icon>
          {{ t('buttons.loginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span
    :title="t('buttons.openSystemSet')"
    class="layout-toolbar__item"
    @click="layoutShellStore.settingsPanelOpen = true"
  >
    <Setting />
  </span>
</template>
<style lang="scss" scoped>
.layout-toolbar__dept {
  padding: 0 6px;
}

.layout-toolbar__user {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  color: var(--auth-text-primary);

  &:hover {
    background: var(--auth-bg-secondary);
  }
}
</style>
