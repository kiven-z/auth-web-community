import { transformI18n } from '@/app/plugins/i18n';
import type { FormItemRule } from 'element-plus';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 18;

/** 8-18 位，且数字、字母、符号中至少包含两类 */
export function isPasswordComplexityValid(value: string): boolean {
  const length = value.length;
  if (length < MIN_PASSWORD_LENGTH || length > MAX_PASSWORD_LENGTH) {
    return false;
  }
  const hasDigit = /\d/.test(value);
  const hasLetter = /[a-zA-Z]/.test(value);
  const hasSymbol = /[^a-zA-Z\d]/.test(value);
  return [hasDigit, hasLetter, hasSymbol].filter(Boolean).length >= 2;
}

/** 新密码复杂度校验规则 */
export const passwordComplexityRule: FormItemRule = {
  validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback();
      return;
    }
    if (!isPasswordComplexityValid(value)) {
      callback(new Error(transformI18n('login.authPassWordRuleReg')));
      return;
    }
    callback();
  },
  trigger: 'blur',
};
