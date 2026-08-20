/** 权限码：单个或列表 */
type AuthCode = string | string[];

/** 多权限匹配模式：all=AND，any=OR */
type AuthMode = 'all' | 'any';

/** 权限下拉菜单项 */
interface AuthDropdownItem {
  /** 展示文案 */
  label: string;
  /** 点击回调 */
  onClick: () => void;
  /** 无权限码则始终可见；有则按 mode 校验 */
  permission?: AuthCode;
  /** 默认 all */
  mode?: AuthMode;
  /** 业务是否展示；默认 true。false 时不进入菜单（不同于 disabled） */
  show?: boolean;
  disabled?: boolean;
  divided?: boolean;
}

export type { AuthCode, AuthDropdownItem, AuthMode };
