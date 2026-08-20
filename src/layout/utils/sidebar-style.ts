/**
 * 解析侧栏子菜单图标 margin
 * @param mode 布局模式
 * @param isCollapse 侧栏是否折叠
 */
export function resolveSubMenuIconMargin(mode: string, isCollapse: boolean): string {
  if (mode === 'horizontal') {
    return '0 5px 0 0';
  }
  if (isCollapse) {
    return '0 auto';
  }
  return '0 5px 0 0';
}
