import debounce from 'lodash/debounce';
import { onScopeDispose, ref } from 'vue';
import { searchUserByKeyword, type UserSearchOption } from '@/features/system/api/user/user-base';
import { errorMessage } from '@/services/feedback/message';

/** 远程用户关键字请求防抖间隔 */
const REMOTE_USER_SEARCH_DEBOUNCE_MS = 300;

/** {@link useRemoteUserSearch} 配置 */
interface UseRemoteUserSearchOptions {
  /** 透传后端的返回条数上限，不传则使用后端默认 */
  limit?: number;
}

/**
 * 远程按关键字搜索用户（用于 `el-select` remote）。
 * @param options 含 limit 等配置
 * @returns 远程用户选项、加载状态与搜索方法
 */
export default function useRemoteUserSearch(options: UseRemoteUserSearchOptions = {}) {
  const { limit } = options;

  const userOptions = ref<UserSearchOption[]>([]);
  const userSearchLoading = ref(false);

  let searchGeneration = 0;

  /**
   * 执行一次远程搜索
   * @param keyword 用户输入关键字
   */
  async function executeSearch(keyword: string) {
    const generation = ++searchGeneration;
    userSearchLoading.value = true;
    try {
      const rows = await searchUserByKeyword(keyword, limit);
      if (generation !== searchGeneration) {
        return;
      }
      userOptions.value = rows;
    } catch (error: unknown) {
      if (generation !== searchGeneration) {
        return;
      }
      errorMessage(error);
      userOptions.value = [];
    } finally {
      if (generation === searchGeneration) {
        userSearchLoading.value = false;
      }
    }
  }

  const debouncedExecuteSearch = debounce((keyword: string) => {
    void executeSearch(keyword);
  }, REMOTE_USER_SEARCH_DEBOUNCE_MS);

  onScopeDispose(() => {
    debouncedExecuteSearch.cancel();
  });

  /**
   * 供 `el-select` `remote-method` 使用
   * @param keyword 用户输入关键字
   */
  const loadUserListByKeyword = (keyword: string) => {
    debouncedExecuteSearch(keyword ?? '');
  };

  return { userOptions, userSearchLoading, loadUserListByKeyword };
}
