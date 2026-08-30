import { ElCheckTag, ElTag } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { USER_GENDER } from '../constants/userEnums';

/**
 * 用户档案相关字段展示（账号状态、性别、主岗标签）
 * @returns 字段渲染函数
 */
function useUserProfileDisplay() {
  const { t } = useI18n();

  /**
   * 用户账号状态（sys_user.status）
   * @param value 状态码
   * @returns 账号状态标签
   */
  function renderUserAccountStatus(value: number | undefined | null) {
    if (value === undefined || value === null) {
      return <span>-</span>;
    }
    switch (value) {
      case 1:
        return (
          <ElTag type="success" effect="plain">
            {t('users.accountStatus.normal')}
          </ElTag>
        );
      case 2:
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
  }

  /**
   * 用户性别（sys_user.gender）
   * @param value 性别码
   * @returns 性别文案
   */
  function renderUserGender(value: number | undefined | null) {
    if (value === USER_GENDER.male) {
      return <span>{t('users.genderLabel.male')}</span>;
    }
    if (value === USER_GENDER.female) {
      return <span>{t('users.genderLabel.female')}</span>;
    }
    return <span>{t('users.genderLabel.unknown')}</span>;
  }

  function renderDeptPrimaryTag() {
    return (
      <ElCheckTag checked type="danger">
        {t('relation.primary')}
      </ElCheckTag>
    );
  }

  function renderDeptNonPrimaryTag() {
    return (
      <ElCheckTag checked={false} type="info">
        {t('relation.nonPrimary')}
      </ElCheckTag>
    );
  }

  function renderPostPrimaryTag() {
    return (
      <ElCheckTag checked type="danger">
        {t('post.enums.primary.yes')}
      </ElCheckTag>
    );
  }

  function renderPostNonPrimaryTag() {
    return (
      <ElCheckTag checked type="primary">
        {t('post.enums.primary.no')}
      </ElCheckTag>
    );
  }

  return {
    renderUserAccountStatus,
    renderUserGender,
    renderDeptPrimaryTag,
    renderDeptNonPrimaryTag,
    renderPostPrimaryTag,
    renderPostNonPrimaryTag,
  };
}

export default useUserProfileDisplay;
