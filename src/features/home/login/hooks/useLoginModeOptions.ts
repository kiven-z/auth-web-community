import type { SelectOption } from '@/shared/types/selectOption';
import { LoginMode } from '@/features/home/login/types/loginMode';
import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 登录方式切换选项（文案随 locale 更新；顺序需与 loginModeRegistry 一致）
 * @returns Segmented 选项列表
 */
export function useLoginModeOptions(): ComputedRef<SelectOption<LoginMode>[]> {
  const { t } = useI18n();

  return computed(() => [
    { value: LoginMode.UsernamePassword, label: t('login.authUsernamePasswordLogin') },
    { value: LoginMode.Email, label: t('login.authEmailLogin') },
    { value: LoginMode.Sms, label: t('login.authSmsLogin') },
  ]);
}
