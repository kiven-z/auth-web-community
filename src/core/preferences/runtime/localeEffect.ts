import { i18n } from '@/app/plugins/i18n';

/**
 * 将 locale 写入 vue-i18n 全局 locale（string 或 ref）
 * @param locale 语言代码
 */
export function applyLocaleToI18n(locale: string): void {
  if (typeof i18n.global.locale === 'string') {
    i18n.global.locale = locale;
  } else {
    i18n.global.locale.value = locale;
  }
}
