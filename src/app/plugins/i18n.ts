import { APP_CONFIG, DEFAULT_LOCALE } from '@/core/config/app-config';
import isObject from 'lodash/isObject';
import merge from 'lodash/merge';
import type { App } from 'vue';
import { unref } from 'vue';
import { createI18n } from 'vue-i18n';

/** transformI18n 可接受的文案：i18n key 或按 locale 映射的标题 */
type TransformI18nMessage = string | Record<string, string>;

/**
 * 扫描子目录（如 zh-CN/buttons.yaml, en/panel.yaml）
 * @returns 国际化配置
 */
const siphonI18n = (function () {
  // 仅初始化一次国际化配置，递归扫描子目录（如 zh-CN/buttons.yaml, en/panel.yaml）
  const cache: Record<string, Record<string, any>> = {};
  const modules = import.meta.glob('../../../locales/**/*.{yaml,yml}', { eager: true });

  for (const [filePath, module] of Object.entries(modules)) {
    // 从路径中提取 "locales/" 之后的第一个目录名作为语言标识（支持任意深度嵌套）
    // 例如: "../../../locales/zh-CN/common/buttons.yaml" → "zh-CN"
    const lang = /locales\/([A-Za-z0-9_-]+)\//.exec(filePath)?.[1];
    if (!lang) continue;

    if (!cache[lang]) {
      cache[lang] = {};
    }
    // 深合并：同名根 key（如 menus）可拆到多个文件而不互相覆盖
    if (isObject(module) && 'default' in module) {
      merge(cache[lang], module.default);
    }
  }

  return (prefix = 'zh-CN') => {
    return cache[prefix] ?? {};
  };
})();

const localesConfigs = Object.fromEntries(
  APP_CONFIG.locales.map(({ locale, el }) => [locale, { ...siphonI18n(locale), ...el }])
);

/**
 * 仅供 i18n Ally 做键名智能提示，运行时原样返回 key；不用国际化时可删
 * @param key 键
 * @returns 键
 */
export const $t = (key: string) => key;

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: 'en',
  messages: localesConfigs,
});

/**
 * 国际化转换工具函数（自动读取根目录 locales 下文件进行匹配）
 * @param message i18n key，或动态路由标题映射 `{ 'zh-CN': '', en: '' }`
 * @returns 转化后的文案；空入参或映射缺当前语言时返回空串
 */
export function transformI18n(message: TransformI18nMessage | null | undefined = ''): string {
  if (!message) {
    return '';
  }

  const localeCode = unref(i18n.global.locale);

  // 动态路由 title：{ 'zh-CN': '', en: '' }
  if (typeof message === 'object') {
    return message[localeCode] ?? '';
  }

  if (i18n.global.te(message)) {
    return i18n.global.t(message);
  }
  return message;
}

export function useI18n(app: App) {
  app.use(i18n);
}
