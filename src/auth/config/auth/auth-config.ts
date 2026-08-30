export const userKey = 'user-info';

/**
 * 开发环境（`import.meta.env.DEV`）下用于在 localStorage 中持久化 accessToken 的键名；生产构建不使用该键。
 * 与历史 Cookie 同名，便于从旧版 Cookie 一次性迁移。
 */
export const TokenKey = 'authorized-token';

/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 */
export const multipleTabsKey = 'multiple-tabs';
