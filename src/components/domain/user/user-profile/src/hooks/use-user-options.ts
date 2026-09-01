import { USER_ACCOUNT_STATUS, USER_GENDER } from '../constants/user-enums';
import type { SelectOption } from '@/shared/types/select-option';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户模块枚举选项（文案随 locale 更新）
 * @returns 账号状态 / 性别
 */
function useUserOptions() {
  const { t } = useI18n();

  const statusFilterOptions = computed<SelectOption<number>[]>(() => [
    { value: USER_ACCOUNT_STATUS.normal, label: t('users.accountStatus.normal') },
    { value: USER_ACCOUNT_STATUS.disabled, label: t('users.accountStatus.disabled') },
    { value: USER_ACCOUNT_STATUS.locked, label: t('users.accountStatus.locked') },
  ]);

  const genderOptions = computed<SelectOption<number>[]>(() => [
    { value: USER_GENDER.unknown, label: t('users.genderLabel.unknown') },
    { value: USER_GENDER.male, label: t('users.genderLabel.male') },
    { value: USER_GENDER.female, label: t('users.genderLabel.female') },
  ]);

  return {
    statusFilterOptions,
    genderOptions,
  };
}

export default useUserOptions;
