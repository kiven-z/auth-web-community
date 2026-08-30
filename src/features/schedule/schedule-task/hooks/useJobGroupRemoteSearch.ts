import { searchJobGroupOptions, type SysJobGroupPageRow } from '@/features/schedule/api/jobGroup';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/** 任务分组远程搜索单次返回条数 */
const JOB_GROUP_REMOTE_SEARCH_LIMIT = 20;

/**
 * 任务分组远程搜索（用于新增任务表单 el-select remote）
 * @returns 分组选项、加载状态与搜索方法
 */
function useJobGroupRemoteSearch() {
  const jobGroupOptions = ref<SysJobGroupPageRow[]>([]);
  const loadingJobGroups = ref(false);

  /**
   * 按关键字远程搜索启用分组
   * @param keyword 用户输入关键字（原样透传，不 trim）
   */
  async function loadJobGroupByKeyword(keyword: string) {
    loadingJobGroups.value = true;
    try {
      jobGroupOptions.value = await searchJobGroupOptions({
        keyword: keyword ?? '',
        limit: JOB_GROUP_REMOTE_SEARCH_LIMIT,
      });
    } catch (error: unknown) {
      errorMessage(error);
      jobGroupOptions.value = [];
    } finally {
      loadingJobGroups.value = false;
    }
  }

  return { jobGroupOptions, loadingJobGroups, loadJobGroupByKeyword };
}

export default useJobGroupRemoteSearch;
