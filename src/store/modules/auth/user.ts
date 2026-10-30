import { logoutApi } from '@/api/login';
import { resetUserDisplayProfileHydration } from '@/core/session/profile/display-profile';
import { readUserProfileFromStorage } from '@/core/session/profile/user-profile-storage';
import { readSessionPreferences, writeSessionPreferences } from '@/core/session/remember/session-preferences';
import { resetSessionBootstrap } from '@/core/session/session-bootstrap';
import { removeToken } from '@/core/session/token/session-token';
import type { UserProfileSnapshot } from '@/core/session/types';
import { storageLocal } from '@/core/storage/storage-local';
import { resetRouter, router } from '@/router';
import { defineStore } from 'pinia';
import type { AuthUserState } from '../../types';
import { useDisplayPreferencesStore } from '../preferences/display-preferences';
import { useLayoutPreferencesStore } from '../preferences/layout-preferences';
import { useLocalePreferencesStore } from '../preferences/locale-preferences';
import { pausePreferencesPersistence, resumePreferencesPersistence } from '../preferences/preferences-persistence';
import { useTagsPreferencesStore } from '../preferences/tags/tags-preferences';
import { useThemePreferencesStore } from '../preferences/theme-preferences';

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
     * 用会话资料快照覆盖当前用户展示态
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
     * 更新「记住登录」偏好（同步写入 session 层 localStorage）
     */
    SET_LOGIN_PREFERENCES(isRemembered: boolean, loginDay: number) {
      this.isRemembered = isRemembered;
      this.loginDay = loginDay;
      writeSessionPreferences({ isRemembered, loginDay });
    },

    /**
     * 清空本机 localStorage、重置界面偏好，并跳转登录页
     */
    async clearLocalSession() {
      pausePreferencesPersistence();
      storageLocal().clear();
      useLocalePreferencesStore().$reset();
      useThemePreferencesStore().$reset();
      useLayoutPreferencesStore().$reset();
      useDisplayPreferencesStore().$reset();
      useTagsPreferencesStore().$reset();
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
      const sessionPreferences = readSessionPreferences();
      this.isRemembered = sessionPreferences.isRemembered;
      this.loginDay = sessionPreferences.loginDay;
      removeToken();
      resetRouter();
      resumePreferencesPersistence();
      await router.push('/login');
    },

    /**
     * 调用退出接口后清理本地并跳转登录
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
