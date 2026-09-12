import { searchPostByKeyword, type SysPostSearchOption } from '@/features/system/api/post/post';
import debounce from 'lodash/debounce';
import { onScopeDispose, ref } from 'vue';

import { errorMessage } from '@/services/feedback/message';

/** 远程岗位关键字请求防抖间隔 */
const REMOTE_POST_SEARCH_DEBOUNCE_MS = 300;

/** 远程岗位搜索单次返回条数上限 */
const REMOTE_POST_SEARCH_LIMIT = 20;

/**
 * 远程按关键字搜索启用岗位（用于 `el-select` remote）。
 * @returns 远程岗位选项、加载状态与搜索方法
 */
export default function useRemotePostSearch() {
  const postOptions = ref<SysPostSearchOption[]>([]);
  const postSearchLoading = ref(false);

  let searchGeneration = 0;

  /**
   * 执行一次远程搜索
   * @param keyword 用户输入关键字
   */
  async function executeSearch(keyword: string) {
    const generation = ++searchGeneration;
    postSearchLoading.value = true;
    try {
      const rows = await searchPostByKeyword({
        keyword,
        status: true,
        limit: REMOTE_POST_SEARCH_LIMIT,
      });
      if (generation !== searchGeneration) {
        return;
      }
      postOptions.value = rows;
    } catch (error: unknown) {
      if (generation !== searchGeneration) {
        return;
      }
      errorMessage(error);
      postOptions.value = [];
    } finally {
      if (generation === searchGeneration) {
        postSearchLoading.value = false;
      }
    }
  }

  const debouncedExecuteSearch = debounce((keyword: string) => {
    void executeSearch(keyword);
  }, REMOTE_POST_SEARCH_DEBOUNCE_MS);

  onScopeDispose(() => {
    debouncedExecuteSearch.cancel();
  });

  /**
   * 供 `el-select` `remote-method` 使用
   * @param keyword 用户输入关键字
   */
  const loadPostListByKeyword = (keyword: string) => {
    debouncedExecuteSearch(keyword ?? '');
  };

  return { postOptions, postSearchLoading, loadPostListByKeyword };
}
