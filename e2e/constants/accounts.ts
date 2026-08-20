/** E2E 固定账号（与 Release 种子 / auth-harness dept_scope_cases 一致） */
export const e2eAccounts = {
  administrator: {
    username: 'Administrator',
    password: 'Admin@123456',
  },
  /** 无角色无 user_scope：路由守卫拒绝受保护菜单 */
  orphanSelf: {
    username: 'orphan_self',
    password: 'Admin@123456',
  },
} as const;
