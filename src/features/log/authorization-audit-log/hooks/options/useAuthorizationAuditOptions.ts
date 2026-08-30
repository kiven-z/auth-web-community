import type { TagSelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权审计枚举选项（文案随 locale 更新）
 * @returns 事件类型
 */
function useAuthorizationAuditOptions() {
  const { t } = useI18n();

  const eventTypeOptions = computed<TagSelectOption[]>(() => [
    { value: 'GRANTED', label: t('authorizationAudit.eventTypeEnum.GRANTED'), tagType: 'success' },
    { value: 'DENIED', label: t('authorizationAudit.eventTypeEnum.DENIED'), tagType: 'danger' },
  ]);

  return {
    eventTypeOptions,
  };
}

export default useAuthorizationAuditOptions;
