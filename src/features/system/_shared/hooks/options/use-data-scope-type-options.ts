import type { DataScopeType } from '@/features/system/api/models/data-scope';
import type { SelectOption } from '@/shared/types/select-option';
import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 数据范围类型选项（文案随 locale 更新）
 * @returns 与库表 scope_type 一致的四项
 */
export function useDataScopeTypeOptions(): ComputedRef<SelectOption<DataScopeType>[]> {
  const { t } = useI18n();

  return computed(() => [
    { value: 'ALL', label: t('dataScope.type.all') },
    { value: 'SELF', label: t('dataScope.type.self') },
    { value: 'IDS', label: t('dataScope.type.ids') },
    { value: 'IDS_AND_CHILD', label: t('dataScope.type.idsAndChild') },
  ]);
}
