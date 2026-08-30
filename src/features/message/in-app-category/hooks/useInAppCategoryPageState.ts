import {
  getInAppMessageCategoryList,
  type InAppMessageCategoryPageRow,
  type InAppMessageCategoryQuery,
} from '@/features/message/api/in-app-category';
import { useListTableState } from '@/components/table/ListTable';
import { handleTree } from '@/shared/utils/tree';
import { reactive, ref } from 'vue';

/** 视图模式 */
export type InAppCategoryViewMode = 'table' | 'tree';

/**
 * 分类页状态挂在模块级，供 index、树表、树面板共用同一套 viewMode / 数据
 */
const searchForm = reactive<InAppMessageCategoryQuery>({
  code: undefined,
  name: undefined,
  status: undefined,
  rootOnly: undefined,
});

const viewMode = ref<InAppCategoryViewMode>('table');

const listState = useListTableState<InAppMessageCategoryPageRow, InAppMessageCategoryQuery>({
  searchForm,
  fetchApi: async (query) => {
    const list = await getInAppMessageCategoryList({
      code: query.code,
      name: query.name,
      status: query.status,
      rootOnly: query.rootOnly,
    });
    return handleTree([...(list ?? [])], 'id', 'parentId') as InAppMessageCategoryPageRow[];
  },
});

/**
 * 站内信业务分类页状态（全量建树，不分页）
 * @returns 列表壳 state、视图模式与刷新
 */
function useInAppCategoryPageState() {
  return {
    ...listState,
    viewMode,
    refresh: listState.fetchTableData,
  };
}

export default useInAppCategoryPageState;
