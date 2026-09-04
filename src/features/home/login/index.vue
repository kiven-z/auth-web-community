<script lang="ts" setup>
import { APP_TITLE } from '@/core/config/app-config';
import { LOCALE_OPTIONS } from '@/core/config/locale-config';
import { useTranslationLang } from '@/shared/composables/i18n/use-translation-lang';
import { getLogoUrl } from '@/shared/utils/platform';
import useLogin from './hooks/use-login';
import { useLoginTheme } from './hooks/use-login-theme';

import IllustrationDark from '@/assets/login/illustration-dark.svg?component';
import IllustrationLight from '@/assets/login/illustration-light.svg?component';
import LoginBackground from '@/assets/login/login-bg.png';
import Check from '~icons/ep/check';
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
/** 浅色人物插画 / 深色科技拓扑，随登录页主题切换 */
const loginIllustration = computed(() => (dataTheme.value ? IllustrationDark : IllustrationLight));
/** 亮色显示月亮、暗色显示太阳：点击切到另一侧 */
const themeToggleIcon = computed(() => (dataTheme.value ? SunIcon : MoonIcon));
</script>

<template>
  <div class="select-none h-full">
    <img :src="LoginBackground" alt="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <button
        ref="themeToggleRef"
        :aria-label="dataTheme ? t('panel.overallStyleLight') : t('panel.overallStyleDark')"
        class="theme-toggler-content theme-toggler inline-flex cursor-pointer outline-hidden"
        type="button"
        @click="onThemeToggle"
      >
        <component :is="themeToggleIcon" class="hover:text-primary hover:bg-transparent! w-5 h-5 duration-300" />
      </button>
      <el-dropdown trigger="click">
        <TranslateIcon
          class="hover:text-primary hover:bg-transparent! w-5 h-5 ml-1.5 cursor-pointer outline-hidden duration-300"
        />
        <template #dropdown>
          <el-dropdown-menu class="translation">
            <el-dropdown-item
              v-for="item in LOCALE_OPTIONS"
              :key="item.locale"
              :class="['dark:text-white!', locale === item.locale ? '' : 'dark:hover:text-primary!']"
              :style="{
                background: locale === item.locale ? 'var(--el-color-primary)' : '',
                color: locale === item.locale ? 'var(--auth-text-anti)' : 'var(--auth-text-primary)',
              }"
              @click="translation(item.locale)"
            >
              <Check v-show="locale === item.locale" class="check-icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="login-container">
      <div aria-hidden="true" class="img">
        <component :is="loginIllustration" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <img :src="logoUrl" alt="" class="login-form__logo" />
          <Motion>
            <h2 class="text-center outline-hidden">{{ APP_TITLE }}</h2>
          </Motion>

          <!-- 动态切换表单组件，:key 变化时 Vue 销毁重建触发入场动画 -->
          <Motion :delay="50">
            <component :is="activeFormComponent" :key="formKey" @login-success="onLoginSuccess" />
          </Motion>

          <Segmented
            :model-value="currentModeIndex"
            :options="loginModeOptions"
            block
            class="mt-2"
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

<!-- view-transition 伪元素挂在 document，不可 scoped；仅 data-theme-transition 触发时播放 -->
<style lang="scss">
@use 'styles/theme-transition';
</style>
