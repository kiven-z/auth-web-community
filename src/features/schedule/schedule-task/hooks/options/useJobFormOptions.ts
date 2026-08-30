import type { SelectOption } from '@/shared/types/selectOption';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 调度任务表单枚举选项（文案随 locale 更新）
 * @returns 任务类型 / 错失策略 / 时区 / Cron 预设
 */
function useJobFormOptions() {
  const { t } = useI18n();

  const taskTypeOptions = computed<SelectOption<'BEAN_INVOKE' | 'CUSTOM_CLASS'>[]>(() => [
    { value: 'BEAN_INVOKE', label: t('scheduleTask.enums.taskType.BEAN_INVOKE') },
    { value: 'CUSTOM_CLASS', label: t('scheduleTask.enums.taskType.CUSTOM_CLASS') },
  ]);

  const misfirePolicyOptions = computed<SelectOption<number>[]>(() => [
    { value: 1, label: t('scheduleTask.enums.misfirePolicy.catchUpAll') },
    { value: 2, label: t('scheduleTask.enums.misfirePolicy.catchUpOnce') },
    { value: 3, label: t('scheduleTask.enums.misfirePolicy.ignore') },
  ]);

  const timeZoneOptions = computed<SelectOption[]>(() => [
    { value: 'Asia/Shanghai', label: t('scheduleTask.enums.timeZone.Asia_Shanghai') },
    { value: 'UTC', label: t('scheduleTask.enums.timeZone.UTC') },
    { value: 'Asia/Hong_Kong', label: t('scheduleTask.enums.timeZone.Asia_Hong_Kong') },
    { value: 'Asia/Tokyo', label: t('scheduleTask.enums.timeZone.Asia_Tokyo') },
    { value: 'Asia/Singapore', label: t('scheduleTask.enums.timeZone.Asia_Singapore') },
    { value: 'Europe/London', label: t('scheduleTask.enums.timeZone.Europe_London') },
    { value: 'America/New_York', label: t('scheduleTask.enums.timeZone.America_New_York') },
  ]);

  const cronPresetOptions = computed<SelectOption[]>(() => [
    { value: '0/3 * * * * ?', label: t('scheduleTask.cronPresets.every3Seconds') },
    { value: '0 0/5 * * * ?', label: t('scheduleTask.cronPresets.every5Minutes') },
    { value: '0 0 * * * ?', label: t('scheduleTask.cronPresets.hourly') },
    { value: '0 0 0 * * ?', label: t('scheduleTask.cronPresets.dailyMidnight') },
    { value: '0 0 9 * * ?', label: t('scheduleTask.cronPresets.daily9am') },
    { value: '0 0 9 ? * MON', label: t('scheduleTask.cronPresets.weeklyMonday9am') },
    { value: '0 0 0 1 * ?', label: t('scheduleTask.cronPresets.monthlyFirstMidnight') },
  ]);

  return {
    taskTypeOptions,
    misfirePolicyOptions,
    timeZoneOptions,
    cronPresetOptions,
  };
}

export default useJobFormOptions;
