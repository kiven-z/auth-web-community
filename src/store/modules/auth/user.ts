import { logoutApi } from '@/api/auth';
import { createDefaultUiPreferences } from '@/core/preferences/defaults/preference-defaults';
import { resetLocalUiPreferences } from '@/core/preferences/persistence/storage';
import { stopSync } from '@/core/preferences/persistence/sync';
import { applyHydratedUiPreferences } from '@/core/preferences/runtime/apply';
import { resetUserDisplayProfileHydration } from '@/core/session/profile/displayProfile';
import { resetSessionBootstrap } from '@/core/session/sessionBootstrap';
import { readSessionPreferences, writeSessionPreferences } from '@/core/session/remember/sessionPreferences';
import { removeToken } from '@/core/session/token/sessionToken';
import type { UserProfileSnapshot } from '@/core/session/types';
import { readUserProfileFromStorage } from '@/core/session/profile/userProfileStorage';
import { routerArrays } from '@/layout/types';
import { resetRouter, router } from '@/router';
import { defineStore } from 'pinia';
import type { AuthUserState } from '../../types';
import { useMultiTagsStore } from '../app/multiTags';

export const useUserStore = defineStore('auth-user', {
  state: (): AuthUserState => {
    const u = readUserProfileFromStorage();
    const prefs = readSessionPreferences();
    return {
      avatar: u.avatar ?? '',
      username: u.username ?? '',
      nickname: u.nickname ?? '',
      primaryDeptId: u.primaryDeptId ?? '',
      primaryDeptName: u.primaryDeptName ?? '',
      userId: u.userId ?? '',
      roles: u.roles ?? [],
      permissions: u.permissions ?? [],
      isRemembered: prefs.isRemembered,
      loginDay: prefs.loginDay,
    };
  },
  actions: {
    /**
     * 用会话资料快照覆盖当前用户展示态。
     * @param profile 用户资料快照
     */
    applyUserProfile(profile: UserProfileSnapshot) {
      this.$patch({
        avatar: profile.avatar,
        username: profile.username,
        nickname: profile.nickname,
        primaryDeptId: profile.primaryDeptId,
        primaryDeptName: profile.primaryDeptName,
        roles: profile.roles,
        permissions: profile.permissions,
        userId: profile.userId,
      });
    },

    /**
     * 更新「记住登录」偏好（同步写入 session 层 localStorage）。
     */
    SET_LOGIN_PREFERENCES(isRemembered: boolean, loginDay: number) {
      this.isRemembered = isRemembered;
      this.loginDay = loginDay;
      writeSessionPreferences({ isRemembered, loginDay });
    },

    /**
     * 清理本地用户态、Token、标签与动态路由，并跳转登录页。
     */
    async clearLocalSession() {
      stopSync();
      resetLocalUiPreferences(createDefaultUiPreferences());
      applyHydratedUiPreferences();
      resetUserDisplayProfileHydration();
      resetSessionBootstrap();
      this.avatar = '';
      this.username = '';
      this.nickname = '';
      this.primaryDeptId = '';
      this.primaryDeptName = '';
      this.userId = '';
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStore().setTags([...routerArrays]);
      resetRouter();
      await router.push('/login');
    },

    /**
     * 调用退出接口后清理本地并跳转登录。
     */
    async logoutAndClear() {
      await logoutApi().catch(() => {
        // 无效 Token 时后端仍返回成功；网络错误也允许继续清理本地
      });
      await this.clearLocalSession();
    },

    /**
     * 仅本地清理（不请求后端），用于 Token 失效等场景
     */
    async logOut() {
      await this.clearLocalSession();
    },
  },
});
