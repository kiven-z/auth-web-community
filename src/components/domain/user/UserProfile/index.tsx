import UserProfileWidget from './src/UserProfile.vue';
import { withInstall } from '@/shared/vue/withInstall';
import { addDialog } from '@/components/ui/Dialog';

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

export { default as UserAvatar } from '../UserAvatar';
export { USER_ACCOUNT_STATUS, USER_GENDER } from './src/constants/userEnums';
export { default as useUserOptions } from './src/hooks/useUserOptions';
export { default as useUserProfileColumns } from './src/hooks/useUserProfileColumns';
export { default as useUserProfileDisplay } from './src/hooks/useUserProfileDisplay';

const UserProfile = withInstall(UserProfileWidget);
export default UserProfile;
