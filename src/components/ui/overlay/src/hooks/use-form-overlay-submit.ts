import { errorMessage, message } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 表单弹层子组件通过 defineExpose 暴露的结构（与 FormDialog 配合使用）
 */
export interface FormOverlayExpose<TForm> {
  formRef?: FormInstance;
  form: TForm;
  /** 可选：特殊首焦；未实现时壳层 focusOnOpen 聚焦内容区第一个可聚焦控件 */
  focusTarget?: () => void;
}

/** {@link useFormOverlaySubmit.createFormBeforeSure} 配置 */
interface CreateFormBeforeSureOptions<TForm> {
  /** 指向表单弹层组件实例的 ref */
  formExposeRef: Ref<FormOverlayExpose<TForm> | null>;
  /**
   * 校验通过后执行业务提交；返回 false 时不关闭弹层
   * @param formData 当前表单数据
   */
  onSubmit: (formData: TForm) => Promise<boolean | void>;
  /** 提交成功后的提示文案 i18n key；不传则不自动 message */
  successI18nKey?: string;
  /** 编辑场景要求 formData 含 id */
  requireId?: boolean;
}

/**
 * 封装 addDialog / addDrawer 的 beforeSure：校验 → 取表单 → 提交 → 成功提示 → done()
 * @returns `createFormBeforeSure` 工厂方法
 */
export function useFormOverlaySubmit() {
  const { t } = useI18n();

  /**
   * 生成 beforeSure 回调
   */
  function createFormBeforeSure<TForm>(options: CreateFormBeforeSureOptions<TForm>) {
    return async (done: (cancel?: boolean) => void) => {
      try {
        const formInstance = options.formExposeRef.value?.formRef;
        const isValid = await formInstance?.validate().catch(() => false);
        if (!isValid) {
          return;
        }

        const formPayload = options.formExposeRef.value?.form;
        if (!formPayload) {
          return;
        }

        if (options.requireId && !(formPayload as { id?: string }).id) {
          return;
        }

        const submitResult = await options.onSubmit(formPayload);
        if (submitResult === false) {
          return;
        }

        if (options.successI18nKey) {
          message(t(options.successI18nKey), { type: 'success' });
        }

        done();
      } catch (error: unknown) {
        errorMessage(error);
      }
    };
  }

  return { createFormBeforeSure };
}
