import type { SelectOption, TagSelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 授权失效枚举选项（文案随 locale 更新）
 * @returns 变更维度 / Outbox 状态 / 处理中
 */
function useAuthorizationInvalidationOptions() {
  const { t } = useI18n();

  const changeKindOptions = computed<SelectOption[]>(() => [
    { value: 'ROLE', label: t('authorizationInvalidation.changeKindEnum.ROLE') },
    { value: 'PERMISSION', label: t('authorizationInvalidation.changeKindEnum.PERMISSION') },
    { value: 'POLICY', label: t('authorizationInvalidation.changeKindEnum.POLICY') },
    { value: 'GRANT', label: t('authorizationInvalidation.changeKindEnum.GRANT') },
    { value: 'USER_DEPT', label: t('authorizationInvalidation.changeKindEnum.USER_DEPT') },
    { value: 'USER_POST', label: t('authorizationInvalidation.changeKindEnum.USER_POST') },
    { value: 'USER', label: t('authorizationInvalidation.changeKindEnum.USER') },
  ]);

  const outboxStatusOptions = computed<TagSelectOption[]>(() => [
    { value: 'PENDING', label: t('authorizationInvalidation.outboxStatusEnum.PENDING'), tagType: 'info' },
    { value: 'PROCESSING', label: t('authorizationInvalidation.outboxStatusEnum.PROCESSING'), tagType: 'warning' },
    { value: 'SUCCESS', label: t('authorizationInvalidation.outboxStatusEnum.SUCCESS'), tagType: 'success' },
    { value: 'FAILED', label: t('authorizationInvalidation.outboxStatusEnum.FAILED'), tagType: 'danger' },
    { value: 'DEAD', label: t('authorizationInvalidation.outboxStatusEnum.DEAD'), tagType: 'danger' },
  ]);

  const processingFilterOptions = computed<TagSelectOption<boolean>[]>(() => [
    { value: true, label: t('authorizationInvalidation.processingEnum.true'), tagType: 'warning' },
    { value: false, label: t('authorizationInvalidation.processingEnum.false'), tagType: 'success' },
  ]);

  return {
    changeKindOptions,
    outboxStatusOptions,
    processingFilterOptions,
  };
}

export default useAuthorizationInvalidationOptions;
