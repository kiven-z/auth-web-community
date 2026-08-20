import { getConfig } from '@/auth/config';
import { defineStore } from 'pinia';
import type { AppSettingsState } from '../../types';

export const useSettingStore = defineStore('auth-setting', {
  state: (): AppSettingsState => ({
    title: getConfig().Title,
    fixedHeader: getConfig().FixedHeader,
    hiddenSideBar: getConfig().HiddenSideBar,
  }),
  getters: {
    getTitle(state) {
      return state.title;
    },
    getFixedHeader(state) {
      return state.fixedHeader;
    },
    getHiddenSideBar(state) {
      return state.hiddenSideBar;
    },
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    },
  },
});
