type SessionLogoutHandler = () => void | Promise<void>;

let sessionLogoutHandler: SessionLogoutHandler | null = null;

/**
 * 注册会话登出处理器（由 bootstrap 注入，通常调用 User Store 的 logOut）。
 * @param handler 登出处理器
 */
export function registerSessionLogout(handler: SessionLogoutHandler): void {
  sessionLogoutHandler = handler;
}

/**
 * 执行已注册的会话登出（鉴权恢复失败等场景由 infrastructure 调用）。
 */
export async function runSessionLogout(): Promise<void> {
  await sessionLogoutHandler?.();
}

/**
 * 重置登出处理器（仅用于单测）。
 */
export function resetSessionLogout(): void {
  sessionLogoutHandler = null;
}
