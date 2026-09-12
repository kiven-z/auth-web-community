import { withInstall } from '@/shared/vue/with-install';

import elTreePanel from './ElTreePanel.vue';

export { treeRowActionsLockKey } from './tree-row-actions-lock';

/** 模块树视图壳：自管顶栏 + 展开收起 + el-tree 行布局 */
const ElTreePanel = withInstall(elTreePanel);

export default ElTreePanel;
