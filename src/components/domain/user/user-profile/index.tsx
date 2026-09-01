import UserProfileWidget from './src/UserProfile.vue';
import { withInstall } from '@/shared/vue/with-install';
import { addDialog } from '@/components/ui/dialog';

/**
 * 查看用户信息
 * @param userId 用户Id
 * @param username 用户名
 */
export const selectUserinfo = async (userId: string, username?: string | null) => {
  addDialog({
    title: username ?? userId ?? '',
    draggable: false,
    contentRenderer: (): JSX.Element => <UserProfile userId={userId} />,
  });
};

export { default as UserAvatar } from '../user-avatar';
export { USER_ACCOUNT_STATUS, USER_GENDER } from './src/constants/user-enums';
export { default as useUserOptions } from './src/hooks/use-user-options';
export { default as useUserProfileColumns } from './src/hooks/use-user-profile-columns';
export { default as useUserProfileDisplay } from './src/hooks/use-user-profile-display';

const UserProfile = withInstall(UserProfileWidget);
export default UserProfile;
