import type { FormRules } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户名密码登录方式的表单校验规则
 */
export function useUsernamePasswordRules() {
  const { t } = useI18n();

  return computed<FormRules>(() => ({
    username: [{ required: true, message: t('login.authUsernameReg'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.authPassWordReg'), trigger: 'blur' }],
  }));
}
