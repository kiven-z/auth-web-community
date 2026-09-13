<script lang="ts" setup>
import { APP_TITLE } from '@/core/config/app-config';
import { getLocaleDef, LOCALES } from '@/core/config/locale-config';
import { useTranslationLang } from '@/shared/composables/i18n/use-translation-lang';
import { getLogoUrl } from '@/shared/utils/platform';
import useLogin from './hooks/use-login';
import { useLoginTheme } from './hooks/use-login-theme';

import IllustrationDark from '@/assets/login/illustration-dark.svg?component';
import IllustrationLight from '@/assets/login/illustration-light.svg?component';
import LoginBackground from '@/assets/login/login-bg.png';
import MoonIcon from '~icons/ri/moon-line';
import SunIcon from '~icons/ri/sun-line';
import TranslateIcon from '~icons/ri/translate';

import Segmented from '@/components/ui/segmented';
import { formComponentMap } from '@/features/home/login/constants/login-registry';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Motion from './components/motion';
import { useLoginModeOptions } from './hooks/use-login-mode-options';
import { useLoginThemeTransition } from './hooks/use-login-theme-transition';

defineOptions({
  name: 'AuthLogin',
});

const { t } = useI18n();

const { dataTheme, persistToggledTheme } = useLoginTheme();
const { themeToggleRef, onThemeToggle } = useLoginThemeTransition(dataTheme, persistToggledTheme);
const logoUrl = getLogoUrl();
const { locale, translation } = useTranslationLang();

const { currentMode, formKey, switchMode, onLoginSuccess } = useLogin();
const loginModeOptions = useLoginModeOptions();

const activeFormComponent = computed(() => formComponentMap[currentMode.value]);
const currentModeIndex = computed(() => loginModeOptions.value.findIndex((item) => item.value === currentMode.value));
const loginIllustration = computed(() => (dataTheme.value ? IllustrationDark : IllustrationLight));
const themeToggleIcon = computed(() => (dataTheme.value ? SunIcon : MoonIcon));
</script>

<template>
  <div class="login">
    <img :src="LoginBackground" alt="" class="login__wave" />

    <div class="login__toolbar">
      <button
        ref="themeToggleRef"
        :aria-label="dataTheme ? t('panel.overallStyleLight') : t('panel.overallStyleDark')"
        class="login__toolbar-item"
        type="button"
        @click="onThemeToggle"
      >
        <component :is="themeToggleIcon" />
      </button>

      <el-dropdown trigger="click">
        <span class="login__toolbar-item">
          <TranslateIcon />
          {{ getLocaleDef(locale).label }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in LOCALES" :key="item.locale" @click="translation(item.locale)">
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="login__container">
      <div aria-hidden="true" class="login__illustration">
        <component :is="loginIllustration" />
      </div>
      <div class="login__box">
        <div class="login__form">
          <img :src="logoUrl" alt="" class="login__logo" />
          <Motion>
            <h2 class="login__title">{{ APP_TITLE }}</h2>
          </Motion>

          <Motion :delay="50">
            <component :is="activeFormComponent" :key="formKey" @login-success="onLoginSuccess" />
          </Motion>

          <Segmented
            :model-value="currentModeIndex"
            :options="loginModeOptions"
            block
            class="login__modes"
            size="default"
            @change="({ option }) => switchMode(option.value)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'styles/login';
</style>

<style lang="scss">
@use 'styles/theme-transition';
</style>
