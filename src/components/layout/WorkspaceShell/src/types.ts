/** 工作空间侧栏菜单项（label 已翻译） */
export interface WorkspaceNavItem {
  /** 分区键（el-menu index） */
  key: string;
  /** 菜单文案 */
  label: string;
  /** Remix Icon 离线键，须在 Icon/src/offline/packs 注册（`ri/图标名`） */
  icon: string;
}

/** 工作空间侧栏分组（title 已翻译） */
export interface WorkspaceNavGroup {
  /** 分组键 */
  key: string;
  /** 分组标题 */
  title: string;
  /** 分组下菜单项 */
  items: WorkspaceNavItem[];
}
