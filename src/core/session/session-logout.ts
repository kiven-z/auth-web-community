type SessionLogoutHandler = () => void | Promise<void>;

let sessionLogoutHandler: SessionLogoutHandler | null = null;

/**
 * 注册会话登出处理器。
 * @param handler 登出处理器
 */
export function registerSessionLogout(handler: SessionLogoutHandler): void {
  sessionLogoutHandler = handler;
}

/**
 * 执行已注册的会话登出。
 */
export async function runSessionLogout(): Promise<void> {
  await sessionLogoutHandler?.();
}

/**
 * 重置登出处理器。
 */
export function resetSessionLogout(): void {
  sessionLogoutHandler = null;
}
