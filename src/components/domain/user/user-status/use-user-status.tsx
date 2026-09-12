import type { SelectOption } from '@/shared/types/select-option';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { USER_ACCOUNT_STATUS, USER_GENDER } from './user-enums';

/**
 * 用户模块枚举选项（文案随 locale 更新）
 * @returns 账号状态 / 性别
 */
function useUserStatus() {
  const { t } = useI18n();

  /**
   * 用户账号状态过滤选项
   */
  const statusFilterOptions = computed<SelectOption<number>[]>(() => [
    { value: USER_ACCOUNT_STATUS.normal, label: t('users.accountStatus.normal') },
    { value: USER_ACCOUNT_STATUS.disabled, label: t('users.accountStatus.disabled') },
    { value: USER_ACCOUNT_STATUS.locked, label: t('users.accountStatus.locked') },
  ]);

  /**
   * 用户账号状态（sys_user.status）
   * @param value 状态码
   * @returns 账号状态标签
   */
  const renderUserAccountStatus = (value: number | undefined | null) => {
    if (value === undefined || value === null) {
      return <span>-</span>;
    }

    switch (value) {
      case USER_ACCOUNT_STATUS.normal:
        return (
          <ElTag type="success" effect="plain">
            {t('users.accountStatus.normal')}
          </ElTag>
        );
      case USER_ACCOUNT_STATUS.locked:
        return (
          <ElTag type="warning" effect="plain">
            {t('users.accountStatus.locked')}
          </ElTag>
        );
      default:
        return (
          <ElTag type="danger" effect="plain">
            {t('users.accountStatus.disabled')}
          </ElTag>
        );
    }
  };

  /**
   * 用户性别过滤选项
   */
  const genderOptions = computed<SelectOption<number>[]>(() => [
    { value: USER_GENDER.unknown, label: t('users.genderLabel.unknown') },
    { value: USER_GENDER.male, label: t('users.genderLabel.male') },
    { value: USER_GENDER.female, label: t('users.genderLabel.female') },
  ]);

  return {
    statusFilterOptions,
    renderUserAccountStatus,
    genderOptions,
  };
}

export default useUserStatus;
