import type {
  InAppMessageSourceType,
  InAppMessageStatusCode,
  InAppRecipientScopeType,
} from '@/features/message/api/inAppMessage';
import type { SelectOption, TagSelectOption } from '@/shared/types/selectOption';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 站内信发送任务枚举选项（文案随 locale 更新）
 * @returns 状态 / 来源 / 接收范围
 */
function useInAppMessageOptions() {
  const { t } = useI18n();

  const statusOptions = computed<TagSelectOption<InAppMessageStatusCode>[]>(() => [
    { value: 'PENDING', label: t('inAppMessage.status.PENDING'), tagType: 'info' },
    { value: 'SENDING', label: t('inAppMessage.status.SENDING'), tagType: 'warning' },
    { value: 'SUCCESS', label: t('inAppMessage.status.SUCCESS'), tagType: 'success' },
    { value: 'PARTIAL', label: t('inAppMessage.status.PARTIAL'), tagType: 'warning' },
    { value: 'FAILED', label: t('inAppMessage.status.FAILED'), tagType: 'danger' },
    { value: 'NO_RECIPIENTS', label: t('inAppMessage.status.NO_RECIPIENTS'), tagType: 'info' },
    { value: 'RECALLED', label: t('inAppMessage.status.RECALLED'), tagType: 'danger' },
  ]);

  const sourceOptions = computed<SelectOption<InAppMessageSourceType>[]>(() => [
    { value: 'ADMIN_COMPOSE', label: t('inAppMessage.sourceType.ADMIN_COMPOSE') },
    { value: 'TEMPLATE', label: t('inAppMessage.sourceType.TEMPLATE') },
    { value: 'SYSTEM', label: t('inAppMessage.sourceType.SYSTEM') },
  ]);

  const scopeOptions = computed<SelectOption<InAppRecipientScopeType>[]>(() => [
    { value: 'USER', label: t('inAppCompose.scope.user') },
    { value: 'POST', label: t('inAppCompose.scope.post') },
    { value: 'DEPT', label: t('inAppCompose.scope.dept') },
    { value: 'ALL', label: t('inAppCompose.scope.all') },
  ]);

  return {
    statusOptions,
    sourceOptions,
    scopeOptions,
  };
}

export default useInAppMessageOptions;
