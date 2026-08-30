import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

/**
 * 新增语言只改这里
 */
export const locales = [
  { locale: 'zh', folder: 'zh-CN', label: '简体中文', el: zhCn },
  { locale: 'en', folder: 'en', label: 'English', el: en },
] as const;

/**
 * 语言类型
 */
export type LocaleType = (typeof locales)[number]['locale'];

/**
 * 语言选项
 */
export const localeOptions = locales.map(({ locale, label }) => ({ locale, label }));

/**
 * 获取语言定义
 * @param locale 语言
 * @returns 语言定义
 */
export function getLocaleDef(locale?: string) {
  return locales.find((l) => l.locale === locale) ?? locales[0];
}
