import { LIST_TABLE_TIPPY_DURATION, LIST_TABLE_TIPPY_OFFSET } from '../constants';

/**
 * 构造工具条图标 tippy 配置
 * @param t i18n `t`
 * @param i18nKey 文案 key
 */
export function tippyOptions(t: (key: string) => string, i18nKey: string) {
  return {
    content: () => t(i18nKey),
    offset: LIST_TABLE_TIPPY_OFFSET,
    duration: LIST_TABLE_TIPPY_DURATION,
    followCursor: true,
    hideOnClick: 'toggle' as const,
  };
}
