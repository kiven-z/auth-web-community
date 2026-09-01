import { getJobCatalogMethods, type QuartzTaskMethodRow, type SysJobCreateForm } from '@/features/schedule/api/job';
import { errorMessage } from '@/services/feedback/message';
import { type Ref, ref, watch } from 'vue';

/**
 * Bean 调用表单：类 → 方法 → invokeTarget 级联选择
 * @param form 含 invokeTarget 的表单引用
 */
function useBeanInvokePicker(form: Ref<Pick<SysJobCreateForm, 'invokeTarget'>>) {
  const selectedBeanClass = ref<string>();
  const selectedBeanMethod = ref<string>();
  const catalogMethods = ref<QuartzTaskMethodRow[]>([]);
  const loadingMethods = ref(false);

  /**
   * 加载 Bean 调用可选方法
   * @param className 类全限定名
   */
  async function loadCatalogMethods(className: string) {
    loadingMethods.value = true;
    catalogMethods.value = [];
    selectedBeanMethod.value = undefined;
    try {
      catalogMethods.value = await getJobCatalogMethods(className);
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      loadingMethods.value = false;
    }
  }

  /** 清空 Bean 级联选择状态 */
  function reset() {
    selectedBeanClass.value = undefined;
    selectedBeanMethod.value = undefined;
    catalogMethods.value = [];
  }

  watch(selectedBeanClass, (className) => {
    if (!className) {
      catalogMethods.value = [];
      selectedBeanMethod.value = undefined;
      return;
    }
    void loadCatalogMethods(className);
  });

  watch(selectedBeanMethod, (methodKey) => {
    if (!methodKey) {
      return;
    }
    const method = catalogMethods.value.find((item) => `${item.methodName}:${item.parameterSignature}` === methodKey);
    if (method) {
      form.value.invokeTarget = method.invokeTargetExample;
    }
  });

  return { selectedBeanClass, selectedBeanMethod, catalogMethods, loadingMethods, reset };
}

export default useBeanInvokePicker;
