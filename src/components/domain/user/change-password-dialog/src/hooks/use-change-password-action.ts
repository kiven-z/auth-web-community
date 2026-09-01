import { changeOwnPassword } from '@/features/system/api/user/user-me';
import { resetUserPassword } from '@/features/system/api/user/user';
import AdminResetPasswordPanel from '../AdminResetPasswordPanel.vue';
import SelfChangePasswordPanel from '../SelfChangePasswordPanel.vue';
import type { AdminResetPasswordForm, SelfChangePasswordForm } from '../types';
import { addDialog } from '@/components/ui/dialog';
import { type FormOverlayExpose, useFormOverlaySubmit } from '@/components/ui/overlay';
import { useUserStore } from '@/store/modules/auth/user';
import { h, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 修改密码弹窗操作
 * @returns 打开弹窗方法
 */
function useChangePasswordAction() {
  const { t } = useI18n();
  const userStore = useUserStore();
  const { createFormBeforeSure } = useFormOverlaySubmit();

  /**
   * 管理员重置他人密码
   * @param userId 目标用户主键
   * @param username 目标用户名
   */
  const openAdminResetPasswordDialog = (userId: string, username: string) => {
    const dialogFormRef = ref<FormOverlayExpose<AdminResetPasswordForm> | null>(null);

    addDialog({
      title: `${t('users.password.reset')} - ${username}`,
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(AdminResetPasswordPanel, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<AdminResetPasswordForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await resetUserPassword(userId, {
            newPassword: formPayload.newPassword,
            confirmPassword: formPayload.confirmPassword,
          });
        },
      }),
    });
  };

  /**
   * 当前用户修改自己的密码
   */
  const openSelfChangePasswordDialog = () => {
    const dialogFormRef = ref<FormOverlayExpose<SelfChangePasswordForm> | null>(null);

    addDialog({
      title: t('users.password.reset'),
      draggable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      contentRenderer: () => h(SelfChangePasswordPanel, { ref: dialogFormRef }),
      beforeSure: createFormBeforeSure<SelfChangePasswordForm>({
        formExposeRef: dialogFormRef,
        successI18nKey: 'tips.editSuccess',
        onSubmit: async (formPayload) => {
          await changeOwnPassword({
            oldPassword: formPayload.oldPassword,
            newPassword: formPayload.newPassword,
            confirmPassword: formPayload.confirmPassword,
          });
          await userStore.logoutAndClear();
        },
      }),
    });
  };

  return {
    openAdminResetPasswordDialog,
    openSelfChangePasswordDialog,
  };
}

export default useChangePasswordAction;
