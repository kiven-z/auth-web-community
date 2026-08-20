import { useI18n } from 'vue-i18n';

/**
 * 表单控件 placeholder 文案（基于 common-page 模板 + 字段 label key）
 * @returns 按控件类型生成占位提示的方法集
 */
export function useFormPlaceholder() {
  const { t } = useI18n();

  return {
    /** 文本输入（列表搜索、普通录入） */
    input: (labelKey: string) => t('placeholder.input', { field: t(labelKey) }),
    /** 下拉筛选（清空表示查全部） */
    selectFilter: (labelKey: string) => t('placeholder.selectFilter', { field: t(labelKey) }),
    /** 下拉选择（弹窗/表单录入） */
    select: (labelKey: string) => t('placeholder.select', { field: t(labelKey) }),
    /** 远程关键字搜索 */
    keyword: (labelKey: string) => t('placeholder.keyword', { field: t(labelKey) }),
    /** 前缀/片段类输入 */
    prefix: (labelKey: string) => t('placeholder.prefix', { field: t(labelKey) }),
    rangeStart: () => t('placeholder.rangeStart'),
    rangeEnd: () => t('placeholder.rangeEnd'),
  };
}
