import { transformI18n } from '@/app/plugins/i18n';
import { ElMessageBox } from 'element-plus';

/** 单层确认文案 */
export interface ConfirmLayer {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

/**
 * 按顺序弹出多层确认；中途取消返回 false
 * @param layers 确认层（至少一层）
 * @returns 是否全部确认
 */
export async function multiConfirm(layers: ConfirmLayer[]): Promise<boolean> {
  if (layers.length === 0) {
    return false;
  }

  try {
    for (const layer of layers) {
      await ElMessageBox.confirm(layer.message ?? layer.title ?? '', layer.title ?? '', {
        confirmButtonText: layer.confirmButtonText ?? transformI18n('buttons.confirm'),
        cancelButtonText: layer.cancelButtonText ?? transformI18n('buttons.close'),
        type: 'warning',
        draggable: true,
        showClose: false,
      });
    }
    return true;
  } catch {
    return false;
  }
}

/** 删除：固定两次确认 */
export function deleteConfirm(): Promise<boolean> {
  return multiConfirm([
    {
      title: transformI18n('tips.deleteConfirm'),
      message: transformI18n('tips.deleteConfirm'),
    },
    {
      title: transformI18n('tips.lastTimeConfirmDeleteTitle'),
      message: transformI18n('tips.lastTimeConfirmDeleteTitle'),
    },
  ]);
}

/** 非删除危险操作：统一一次确认 */
export function operationConfirm(): Promise<boolean> {
  return multiConfirm([
    {
      title: transformI18n('tips.confirmTitle'),
      message: transformI18n('tips.confirmTitle'),
    },
  ]);
}
