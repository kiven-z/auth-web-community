import { transformI18n } from '@/app/plugins/i18n';
import { usePermissionStore } from '@/store/modules/auth/permission';
import { useDebounceFn } from '@vueuse/core';
import cloneDeep from 'lodash/cloneDeep';
import { computed, type Ref, type ShallowRef } from 'vue';

import { filterMenusByKeyword, type MenuTreeNode } from '../utils/menuSearchQuery';

interface UseMenuSearchOptions {
  keyword: Ref<string>;
  resultOptions: ShallowRef<MenuTreeNode[]>;
  activePath: Ref<string>;
}

/**
 * 菜单搜索：扁平化菜单树并按标题关键字过滤
 * @param options 关键字与结果状态
 * @returns 防抖搜索
 */
export function useMenuSearch(options: UseMenuSearchOptions) {
  const menusData = computed(() => cloneDeep(usePermissionStore().wholeMenus) as MenuTreeNode[]);

  function runSearch() {
    options.resultOptions.value = filterMenusByKeyword(menusData.value, options.keyword.value, (meta) =>
      transformI18n(meta?.title)
    );
    options.activePath.value = options.resultOptions.value[0]?.path ?? '';
  }

  const handleSearch = useDebounceFn(runSearch, 300);

  return { handleSearch };
}
