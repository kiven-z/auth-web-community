import { localeOptions, type LocaleType } from '@/auth/config/locales';
import { getLocaleSnapshot, patchLocale } from '@/core/preferences/persistence/storage';
import { changeDocumentTitle } from '@/layout/composables/useDocumentTitle';
import { onBeforeMount, type Ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

/**
 * 导航栏语言切换；附带偏好持久化
 * @param menuRef 可选菜单 ref，切换语言后触发 handleResize
 * @returns i18n、translation
 */
export function useTranslationLang(menuRef?: Ref<{ handleResize?: () => void } | undefined>) {
  const { locale, t } = useI18n();
  const route = useRoute();

  /**
   * 设置界面语言并持久化
   * @param localeValue 语言代码
   */
  function setLocale(localeValue: LocaleType): void {
    patchLocale({ locale: localeValue });
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
      changeDocumentTitle(route.meta);
    }
  );

  onBeforeMount(() => {
    locale.value = getLocaleSnapshot().locale ?? 'zh';
  });

  return {
    t,
    route,
    locale,
    translation,
    localeOptions,
  };
}
