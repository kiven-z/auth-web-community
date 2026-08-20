/**
 * 角色已绑定菜单项（授权面分页行）
 */
export interface RoleBoundMenuItem {
  id: string;
  title: string;
  name?: string;
  path?: string;
  menuType: number;
  status: boolean;
}
