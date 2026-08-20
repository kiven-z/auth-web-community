/** 工作台返回目标：路径或具名路由 */
export type WorkstationBackTarget = string | { name: 'SystemUser' };

/**
 * 解析用户工作台返回目标：来源页 → SystemUser → 首页
 */
export function resolveWorkstationBackTarget(historyFrom: unknown, hasSystemUserRoute: boolean): WorkstationBackTarget {
  if (typeof historyFrom === 'string' && historyFrom.startsWith('/')) {
    return historyFrom;
  }
  if (hasSystemUserRoute) {
    return { name: 'SystemUser' };
  }
  return '/';
}
