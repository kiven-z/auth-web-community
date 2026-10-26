/**
 * grant_table 与角色分配抽屉共用类型
 */

/**
 * 统一授权主体类型（与后端 GrantTableSubjectType 一致）
 */
export type GrantTableSubjectType = 'USER' | 'DEPT' | 'POST';

/**
 * 角色关联回显
 */
export interface RoleReference {
  id: string;
  roleCode: string;
  roleName: string;
  status: boolean;
}

/**
 * 用户关联回显
 */
export interface UserReference {
  id: string;
  username: string;
  status: number;
  nickname: string;
  avatar?: string;
  gender?: number;
  employeeNo?: string;
}

/**
 * 部门关联回显
 */
export interface DeptReference {
  id: string;
  deptName: string;
  deptCode: string;
}

/**
 * 岗位关联回显
 */
export interface PostReference {
  id: string;
  postCode: string;
  postName: string;
}

/**
 * 权限关联回显
 */
export interface PermissionReference {
  id: string;
  permissionCode: string;
  permissionName: string;
  status: boolean;
}

/**
 * 部门 / 岗位详情-关联用户回显
 */
export type BoundUserReference = UserReference & {
  isPrimary: boolean;
};

/**
 * 全量覆盖主体角色授权请求（用户 / 部门 / 岗位 / 菜单）
 */
export interface GrantTableAssignRoleRequest {
  roleIds: string[];
}

/**
 * 菜单已分配角色回显
 */
export type MenuAssignedRoleRow = RoleReference & {
  assigned: boolean;
};
