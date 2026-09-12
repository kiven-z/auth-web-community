import { addDialog } from '@/components/ui/dialog';
import { withInstall } from '@/shared/vue/with-install';
import UserProfileWidget from './src/UserProfile.vue';

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

const UserProfile = withInstall(UserProfileWidget);
export default UserProfile;
