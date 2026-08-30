import type { SelectOption } from '@/shared/types/select-option';
import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 通用启用/禁用状态下拉选项（文案随 locale 更新）
 * @returns 启用 / 禁用两项
 */
export function useCommonBooleanStatusOptions(): ComputedRef<SelectOption<boolean>[]> {
  const { t } = useI18n();

  return computed(() => [
    { value: true, label: t('buttons.statusActiveText') },
    { value: false, label: t('buttons.statusInactiveText') },
  ]);
}
