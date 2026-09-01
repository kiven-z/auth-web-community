/** 已打包的离线图标键名集合（`集合/图标名`），由各 pack 注册时写入 */
export const offlineIconNameSet = new Set<string>();

/** 只读视图，供渲染层判断是否走离线组件 */
export const offlineIconNames: ReadonlySet<string> = offlineIconNameSet;
