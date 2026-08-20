import type { FormRules } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 邮箱登录方式的表单校验规则
 */
export function useEmailLoginRules() {
  const { t } = useI18n();

  return computed<FormRules>(() => ({
    email: [
      { required: true, message: t('login.authEmailReg'), trigger: 'blur' },
      { type: 'email', message: t('login.authEmailFormatReg'), trigger: 'blur' },
    ],
    code: [{ required: true, message: t('login.authCodeReg'), trigger: 'blur' }],
  }));
}
