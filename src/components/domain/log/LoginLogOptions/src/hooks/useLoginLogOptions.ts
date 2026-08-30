import type { SelectOption, TagSelectOption } from '@/shared/types/selectOption';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录日志枚举选项（文案随 locale 更新）
 * @returns 登录结果 / 登录类型
 */
function useLoginLogOptions() {
  const { t } = useI18n();

  const loginResultOptions = computed<TagSelectOption<number>[]>(() => [
    { value: 0, label: t('loginLog.result.success'), tagType: 'success' },
    { value: 1, label: t('loginLog.result.badCredential'), tagType: 'danger' },
    { value: 2, label: t('loginLog.result.accountLocked'), tagType: 'warning' },
    { value: 3, label: t('loginLog.result.captchaError'), tagType: 'info' },
    { value: 4, label: t('loginLog.result.accountDisabled'), tagType: 'info' },
  ]);

  const loginTypeOptions = computed<SelectOption[]>(() => [
    { value: 'LOGIN_EMAIL', label: t('loginLog.type.LOGIN_EMAIL') },
    { value: 'LOGIN_SMS', label: t('loginLog.type.LOGIN_SMS') },
    { value: 'LOGIN_PASSWORD', label: t('loginLog.type.LOGIN_PASSWORD') },
    { value: 'REFRESH_TOKEN', label: t('loginLog.type.REFRESH_TOKEN') },
    { value: 'LOGOUT', label: t('loginLog.type.LOGOUT') },
  ]);

  return {
    loginResultOptions,
    loginTypeOptions,
  };
}

export default useLoginLogOptions;
