import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';

/**
 * 语言表
 * locale 对应 locales/ 下目录名
 */
export const LOCALES = [
  { locale: 'zh-CN', label: '简体中文', el: zhCn },
  { locale: 'en', label: 'English', el: en },
] as const;

/** 语言代码 */
export type LocaleType = (typeof LOCALES)[number]['locale'];

/** 默认语言 = 语言表首项 */
export const DEFAULT_LOCALE: LocaleType = LOCALES[0].locale;

/**
 * 获取语言定义
 * @param locale 语言代码
 * @returns 语言定义；未命中为表首项
 */
export function getLocaleDef(locale?: string) {
  return LOCALES.find((l) => l.locale === locale) ?? LOCALES[0];
}
