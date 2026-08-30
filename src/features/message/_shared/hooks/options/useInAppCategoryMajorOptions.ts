import { type InAppMessageCategoryOption, listInAppMessageCategoryMajors } from '@/features/message/api/inAppCategory';
import { errorMessage } from '@/services/feedback/message';
import { ref } from 'vue';

/**
 * 大类选项
 * @param status 启停状态；不传则不限
 * @returns 大类选项、加载状态与加载方法
 */
export function useInAppCategoryMajorOptions(status?: boolean) {
  const majorOptions = ref<InAppMessageCategoryOption[]>([]);
  const loadingMajors = ref(false);

  /** 加载大类选项 */
  async function loadMajors() {
    loadingMajors.value = true;
    try {
      const rows = await listInAppMessageCategoryMajors(status);
      majorOptions.value = (rows ?? []).filter((item) => Boolean(item.id));
    } catch (error: unknown) {
      errorMessage(error);
      majorOptions.value = [];
    } finally {
      loadingMajors.value = false;
    }
  }

  return { majorOptions, loadingMajors, loadMajors };
}
