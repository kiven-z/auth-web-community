<script lang="ts" setup>
import NoticeBadge from '@/components/domain/message/notice-badge';
import { UserAvatar } from '@/components/domain/user/user-profile';
import { APP_CONFIG, getLocaleDef } from '@/core/config/app-config';
import { useOpenPersonalWorkspace } from '@/features/home/personal/hooks/use-open-personal-workspace';
import MenuSearch from '@/layout/chrome/search/MenuSearch.vue';
import { useTranslationLang } from '@/shared/composables/i18n/use-translation-lang';
import { copyToClipboard } from '@/shared/utils/clipboard';
import { useUserStore } from '@/store/modules/auth/user';
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
const userStore = useUserStore();

/** 昵称优先，否则用户名 */
const displayName = computed(() => userStore.nickname || userStore.username);
const primaryDeptName = computed(() => userStore.primaryDeptName ?? '');

const { t, locale: currentLocale, translation } = useTranslationLang(toRef(props, 'menuInstance'));

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
    <span class="layout-toolbar__locale">
      <TranslateIcon />
      <span class="font-bold">{{ getLocaleDef(currentLocale).label }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item v-for="item in APP_CONFIG.locales" :key="item.locale" @click="translation(item.locale)">
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
      <UserAvatar :avatar="userStore.avatar" :name="displayName" :size="26" />
      <span v-if="displayName">{{ displayName }}</span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>
          <div class="layout-toolbar__account">
            <UserAvatar :avatar="userStore.avatar" :name="displayName" :size="36" />
            <div class="layout-toolbar__account-meta">
              <span v-if="displayName" @click.stop="copyToClipboard(userStore.username)">{{ displayName }}</span>
              <span v-if="userStore.userId" @click.stop="copyToClipboard(userStore.userId)">
                ID:{{ userStore.userId }}
              </span>
            </div>
          </div>
        </el-dropdown-item>

        <el-dropdown-item divided @click="openPersonalWorkspace('PersonalProfile')">
          <el-icon>
            <UserSettingsLine />
          </el-icon>
          {{ t('personal.title') }}
        </el-dropdown-item>

        <el-dropdown-item @click="userStore.logoutAndClear()">
          <el-icon>
            <LogoutCircleRLine />
          </el-icon>
          {{ t('buttons.loginOut') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <span
    :title="t('buttons.openSystemSet')"
    class="layout-toolbar__item"
    @click="openPersonalWorkspace('PersonalAppearance')"
  >
    <Setting />
  </span>
</template>

<style lang="scss" scoped>
.layout-toolbar__locale {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  height: 48px;
  padding: 0 10px;
  white-space: nowrap;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--auth-bg-secondary);
  }
}

.layout-toolbar__dept {
  padding: 0 6px;
  font-weight: bold;
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

.layout-toolbar__account {
  display: flex;
  gap: 8px;
  align-items: center;
}

.layout-toolbar__account-meta {
  display: flex;
  flex-direction: column;
}
</style>
