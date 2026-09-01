import { constantMenus } from '@/router/routes';
import { ascending, filterNoPermissionTree, filterTree } from '@/router/utils/menu-sort';
import { formatFlatteningRoutes } from '@/router/utils/route-tree';
import { getKeyList } from '@/shared/utils/array/get-key-list';
import { defineStore } from 'pinia';
import type { KeepAliveCacheOp } from '../../types';
import { useTagsPreferencesStore } from '@/store/modules/preferences/tags/tags-preferences';
import { useUserStore } from '@/store/modules/auth/user';

export const usePermissionStore = defineStore('auth-permission', {
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 整体路由（一维数组格式）
    flatteningRoutes: [],
    // 缓存页面keepAlive
    cachePageList: [],
  }),
  actions: {
    /**
     * 组装整体路由生成的菜单
     * @param routes
     */
    handleWholeMenus(routes: any[]) {
      const roles = useUserStore().roles ?? [];
      this.wholeMenus = filterNoPermissionTree(filterTree(ascending(this.constantMenus.concat(routes))), roles);
      this.flatteningRoutes = formatFlatteningRoutes(this.constantMenus.concat(routes) as any);
    },
    /**
     * 监听缓存页面是否存在于标签页，不存在则删除
     */
    clearCache() {
      const nameSet = new Set(getKeyList(useTagsPreferencesStore().multiTags, 'name'));
      this.cachePageList = this.cachePageList.filter((name) => nameSet.has(name));
    },
    cacheOperate({ mode, name }: KeepAliveCacheOp) {
      const delIndex = this.cachePageList.indexOf(name);
      switch (mode) {
        case 'refresh':
          this.cachePageList = this.cachePageList.filter((v) => v !== name);
          this.clearCache();
          break;
        case 'add':
          this.cachePageList.push(name);
          break;
        case 'delete':
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          this.clearCache();
          break;
      }
    },
    /**
     * 清空缓存页面
     */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    },
  },
});
