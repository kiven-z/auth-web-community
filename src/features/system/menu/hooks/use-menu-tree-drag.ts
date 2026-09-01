import { moveMenu, type SysMenuTreeNode } from '@/features/system/api/menu/menu';
import { transformI18n } from '@/app/plugins/i18n';
import { useElTreeMoveDrag } from '@/features/system/_shared/hooks/use-el-tree-move-drag';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** {@link useMenuTreeDrag} 配置 */
export interface UseMenuTreeDragOptions {
  treeData: Ref<SysMenuTreeNode[]>;
  onMoved: () => Promise<void>;
}

/** 菜单树拖拽移动 */
export function useMenuTreeDrag(options: UseMenuTreeDragOptions) {
  const { t } = useI18n();
  const { treeData, onMoved } = options;

  const menuLabel = (node: SysMenuTreeNode) => transformI18n(node.title);

  return useElTreeMoveDrag<SysMenuTreeNode>({
    treeData,
    getNodeLabel: menuLabel,
    onMoved,
    moveNode: (id, parentId) => moveMenu(id, { parentId }),
    messages: {
      confirmTitle: t('sysMenu.moveConfirmTitle'),
      confirmInner: (dragged, dropTarget) =>
        t('sysMenu.moveConfirmInner', { menu: menuLabel(dragged), parent: menuLabel(dropTarget) }),
      confirmSibling: (dragged, dropTarget, parentLabel) =>
        t('sysMenu.moveConfirmSibling', {
          menu: menuLabel(dragged),
          peer: menuLabel(dropTarget),
          parent: parentLabel,
        }),
      success: t('sysMenu.moveSuccess'),
      topLevelLabel: t('sysMenu.parentTopLevel'),
    },
  });
}
