/** 管理员重置密码表单 */
export interface AdminResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

/** 当前用户修改密码表单 */
export interface SelfChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
