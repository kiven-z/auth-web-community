import type { FormRules } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 短信登录方式的表单校验规则
 */
export function useSmsLoginRules() {
  const { t } = useI18n();

  return computed<FormRules>(() => ({
    phone: [
      { required: true, message: t('login.authPhoneReg'), trigger: 'blur' },
      { pattern: /^1[3-9]\d{9}$/, message: t('login.authPhoneFormatReg'), trigger: 'blur' },
    ],
    code: [{ required: true, message: t('login.authCodeReg'), trigger: 'blur' }],
  }));
}
