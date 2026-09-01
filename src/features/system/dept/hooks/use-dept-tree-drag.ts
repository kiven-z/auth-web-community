import { moveDept, type SysDeptTreeNode } from '@/features/system/api/dept/dept';
import { useElTreeMoveDrag } from '@/features/system/_shared/hooks/use-el-tree-move-drag';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** {@link useDeptTreeDrag} 配置 */
export interface UseDeptTreeDragOptions {
  treeData: Ref<SysDeptTreeNode[]>;
  onMoved: () => Promise<void>;
}

/** 部门树拖拽移动 */
export function useDeptTreeDrag(options: UseDeptTreeDragOptions) {
  const { t } = useI18n();
  const { treeData, onMoved } = options;

  return useElTreeMoveDrag<SysDeptTreeNode>({
    treeData,
    getNodeLabel: (node) => node.deptName,
    onMoved,
    moveNode: (id, parentId) => moveDept({ id, parentId }),
    messages: {
      confirmTitle: t('dept.move.confirmTitle'),
      confirmInner: (dragged, dropTarget) =>
        t('dept.move.confirmInner', { dept: dragged.deptName, parent: dropTarget.deptName }),
      confirmSibling: (dragged, dropTarget, parentLabel) =>
        t('dept.move.confirmSibling', {
          dept: dragged.deptName,
          peer: dropTarget.deptName,
          parent: parentLabel,
        }),
      success: t('dept.message.moveSuccess'),
      topLevelLabel: t('dept.field.parentTopLevel'),
    },
  });
}
