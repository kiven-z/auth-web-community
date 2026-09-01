import type { InjectionKey } from 'vue';

/** 树行操作区在下拉打开期间的锁定上下文 */
export interface TreeRowActionsLockContext {
  /** 下拉展开时锁定对应节点，避免 hover 卸载操作区 */
  lock: (nodeKey: string) => void;
  /** 下拉关闭时解除锁定 */
  unlock: (nodeKey: string) => void;
}

export const treeRowActionsLockKey: InjectionKey<TreeRowActionsLockContext> = Symbol('treeRowActionsLock');
