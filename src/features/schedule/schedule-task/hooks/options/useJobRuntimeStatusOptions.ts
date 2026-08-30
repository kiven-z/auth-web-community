import type {
  SysJobLastExecutionStatus,
  SysJobQuartzRuntimeStatus,
} from '@/features/schedule/api/models/job-runtime-status';
import type { TagSelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 调度任务运行态选项（文案随 locale 更新）
 * @returns Quartz 运行态 / 最近执行结果
 */
function useJobRuntimeStatusOptions() {
  const { t } = useI18n();

  const quartzRuntimeStatusOptions = computed<TagSelectOption<SysJobQuartzRuntimeStatus>[]>(() => [
    { value: 'NOT_REGISTERED', label: t('scheduleTask.enums.quartzStatus.NOT_REGISTERED'), tagType: 'info' },
    { value: 'IDLE', label: t('scheduleTask.enums.quartzStatus.IDLE'), tagType: 'success' },
    { value: 'RUNNING', label: t('scheduleTask.enums.quartzStatus.RUNNING'), tagType: 'warning' },
    { value: 'PENDING', label: t('scheduleTask.enums.quartzStatus.PENDING'), tagType: 'warning' },
    { value: 'PAUSED', label: t('scheduleTask.enums.quartzStatus.PAUSED'), tagType: 'info' },
    { value: 'ERROR', label: t('scheduleTask.enums.quartzStatus.ERROR'), tagType: 'danger' },
  ]);

  const lastExecutionStatusOptions = computed<TagSelectOption<SysJobLastExecutionStatus>[]>(() => [
    { value: 'SUCCESS', label: t('scheduleTask.enums.lastExecutionStatus.SUCCESS'), tagType: 'success' },
    { value: 'FAILED', label: t('scheduleTask.enums.lastExecutionStatus.FAILED'), tagType: 'danger' },
    { value: 'UNKNOWN', label: t('scheduleTask.enums.lastExecutionStatus.UNKNOWN'), tagType: 'info' },
  ]);

  return {
    quartzRuntimeStatusOptions,
    lastExecutionStatusOptions,
  };
}

export default useJobRuntimeStatusOptions;
