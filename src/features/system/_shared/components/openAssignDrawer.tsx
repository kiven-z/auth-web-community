import { transformI18n } from '@/app/plugins/i18n';
import { addDrawer } from '@/components/ui/Drawer';
import { errorMessage, message } from '@/services/feedback/message';
import type { Ref, VNode } from 'vue';

/** {@link openAssignDrawer} 参数 */
export interface OpenAssignDrawerOptions {
  title: string;
  /** 已选 key，确定时提交 */
  selectedKeys: Ref<string[]>;
  /**
   * 渲染分配面板
   * @returns 面板 VNode
   */
  contentRenderer: () => VNode;
  /**
   * 确定：提交当前选中 keys
   * @param selectedKeys 选中 key 列表
   */
  onSubmit: (selectedKeys: string[]) => Promise<void>;
  /** 抽屉宽度，默认 `100%` */
  size?: string | number;
  /** 是否可拖拽调整宽度，默认 `true` */
  resizable?: boolean;
  /** 提交成功提示 i18n key；默认 `tips.assignSaveSuccess`；传空串则不提示 */
  successI18nKey?: string;
  /** 提交成功并关闭前的收尾（如刷新列表） */
  afterSave?: () => void | Promise<void>;
}

/**
 * 打开分配抽屉：全屏壳 + 确定提交选中 keys
 * @param options 抽屉与提交参数
 */
export function openAssignDrawer(options: OpenAssignDrawerOptions): void {
  const {
    title,
    selectedKeys,
    size = '100%',
    resizable = true,
    contentRenderer,
    onSubmit,
    successI18nKey = 'tips.assignSaveSuccess',
    afterSave,
  } = options;

  addDrawer({
    title,
    size,
    resizable,
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: true,
    contentRenderer,
    beforeSure: async (done) => {
      try {
        await onSubmit([...selectedKeys.value]);
        if (successI18nKey) {
          message(transformI18n(successI18nKey), { type: 'success' });
        }
        await afterSave?.();
        done();
      } catch (error: unknown) {
        errorMessage(error);
      }
    },
  });
}
