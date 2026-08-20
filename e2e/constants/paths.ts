/** E2E 路由与 Playwright storageState 路径 */
export const e2eBaseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';

export const e2ePaths = {
  login: '/login',
  welcome: '/welcome',
  systemUser: '/system/user',
  systemOnlineUser: '/system/online-user',
} as const;

export const storageStatePaths = {
  administrator: 'e2e/.auth/administrator.json',
  orphanSelf: 'e2e/.auth/orphan-self.json',
} as const;
