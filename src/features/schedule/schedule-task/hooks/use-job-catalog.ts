import { getJobCatalogClasses, type QuartzTaskClassRow } from '@/features/schedule/api/job';
import { errorMessage } from '@/services/feedback/message';
import { computed, ref } from 'vue';

/** 表单可选的任务类调用模式 */
export type JobCatalogInvokeMode = 'BEAN_INVOKE' | 'CUSTOM_CLASS';
/**
 * 白名单任务类目录：加载、按调用模式分组、解析 job_params 示例
 */
function useJobCatalog() {
  const catalogClasses = ref<QuartzTaskClassRow[]>([]);

  const catalogByMode = computed<Record<JobCatalogInvokeMode, QuartzTaskClassRow[]>>(() => ({
    BEAN_INVOKE: catalogClasses.value.filter((item) => item.invokeModes?.includes('BEAN_INVOKE')),
    CUSTOM_CLASS: catalogClasses.value.filter((item) => item.invokeModes?.includes('CUSTOM_CLASS')),
  }));

  /**
   * 按类名解析 job_params 示例原文
   * @param className 类全限定名
   */
  function findJobParamsExample(className: string): string | undefined {
    return catalogByMode.value.CUSTOM_CLASS.find((item) => item.className === className)?.jobParamsExample;
  }

  /**
   * 加载白名单任务类
   */
  async function loadCatalogClasses() {
    try {
      catalogClasses.value = await getJobCatalogClasses();
    } catch (error: unknown) {
      errorMessage(error);
    }
  }

  return { catalogClasses, catalogByMode, findJobParamsExample, loadCatalogClasses };
}

export default useJobCatalog;
