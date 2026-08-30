import type { LocaleType } from '@/core/config/localeConfig';
import { type Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { transformI18n } from '@/app/plugins/i18n';
import { APP_TITLE } from '@/core/config/appConfig';
import { useLocalePreferencesStore } from '@/store/modules/preferences/localePreferences';

/**
 * 导航栏语言切换；附带偏好持久化。
 * @param menuRef 可选菜单 ref，切换语言后触发 handleResize
 * @returns i18n、translation
 */
export function useTranslationLang(menuRef?: Ref<{ handleResize?: () => void } | undefined>) {
  const { locale, t } = useI18n();
  const route = useRoute();
  const localeStore = useLocalePreferencesStore();

  /**
   * 设置界面语言并持久化
   * @param localeValue 语言代码
   */
  function setLocale(localeValue: LocaleType): void {
    localeStore.setLocale(localeValue);
    locale.value = localeValue;
  }

  /**
   * 切换语言并可选刷新横向菜单尺寸
   * @param localeValue 目标语言
   */
  function translation(localeValue: LocaleType): void {
    setLocale(localeValue);
    menuRef?.value?.handleResize?.();
  }

  watch(
    () => locale.value,
    () => {
      document.title = `${transformI18n(route.meta.title)} | ${APP_TITLE}`;
    }
  );

  return {
    t,
    route,
    locale,
    translation,
  };
}
