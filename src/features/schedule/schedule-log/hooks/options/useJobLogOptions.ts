import type { SelectOption, TagSelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 任务日志枚举选项（文案随 locale 更新）
 * @returns 执行结果 / 触发类型
 */
function useJobLogOptions() {
  const { t } = useI18n();

  const statusOptions = computed<TagSelectOption<boolean>[]>(() => [
    { value: true, label: t('logJob.status.success'), tagType: 'success' },
    { value: false, label: t('logJob.status.failed'), tagType: 'danger' },
  ]);

  const triggerTypeOptions = computed<SelectOption[]>(() => [
    { value: 'SCHEDULE', label: t('logJob.triggerType.schedule') },
    { value: 'MANUAL', label: t('logJob.triggerType.manual') },
    { value: 'RETRY', label: t('logJob.triggerType.retry') },
  ]);

  return {
    statusOptions,
    triggerTypeOptions,
  };
}

export default useJobLogOptions;
