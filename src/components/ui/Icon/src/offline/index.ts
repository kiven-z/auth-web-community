/**
 * 本地离线图标入口：按集合 pack 注册，仅打包 `ri/*`、`ep/*`。
 * 包外请从 `@/components/ui/Icon` 引入（index 已副作用加载 shell）。
 * https://icon-sets.iconify.design/ri/  https://icon-sets.iconify.design/ep/
 */
import './shell';

export { ALLOWED_ICON_COLLECTIONS } from './constants';
export { offlineIconNames } from './nameSet';
