import { TokenKey } from '@/auth/config/auth/auth-config';
import { storageLocal } from '@/core/storage/storageLocal';
import Cookies from 'js-cookie';

/**
 * 写入 access token 存储介质时携带的字段（expires 为毫秒时间戳，与现有 user-info 一致）。
 */
interface AccessTokenStorePayload {
  accessToken: string;
  expires: number;
}

/**
 * 访问令牌读写抽象：生产为内存实现，开发为 localStorage，避免在业务函数中散落环境判断。
 */
interface AccessTokenReadWriter {
  /**
   * 当前可用的 accessToken，没有则返回空串
   */
  get(): string;

  /**
   * 是否存在非空 accessToken
   */
  has(): boolean;

  /**
   * 设置 access token
   * @param payload 负载
   */
  set(payload: AccessTokenStorePayload): void;

  /**
   * 清除 access token
   */
  clear(): void;
}

/**
 * 生产环境：accessToken 仅驻留内存，页面刷新后依赖刷新令牌链路恢复。
 */
class MemoryAccessTokenStore implements AccessTokenReadWriter {
  private accessToken = '';

  /**
   * 获取 access token
   * @return access token
   */
  get(): string {
    return this.accessToken;
  }

  /**
   * 是否存在非空 access token
   * @return 是否存在非空 access token
   */
  has(): boolean {
    return this.accessToken.length > 0;
  }

  /**
   * 设置 access token
   * @param payload 负载
   */
  set(payload: AccessTokenStorePayload): void {
    this.accessToken = payload.accessToken;
  }

  /**
   * 清除 access token
   */
  clear(): void {
    this.accessToken = '';
  }
}

interface DevPersistedShape {
  /** 访问令牌 */
  accessToken?: string;
  /** 过期时间（时间戳） */
  expires?: number;
}

/**
 * 开发环境：accessToken 持久化到 localStorage，减轻 Vite HMR 清空内存导致的误登出。
 * 若仍存在旧版 `TokenKey` Cookie，首次读取时迁移到 localStorage 并删除 Cookie。
 */
class DevLocalStorageAccessTokenStore implements AccessTokenReadWriter {
  constructor(private readonly storageKey: string) {}

  /**
   * 获取 access token
   * @return access token
   */
  get(): string {
    return this.resolveToken();
  }

  /**
   * 是否存在非空 access token
   * @return 是否存在非空 access token
   */
  has(): boolean {
    return this.resolveToken().length > 0;
  }

  /**
   * 设置 access token
   * @param payload 负载
   */
  set(payload: AccessTokenStorePayload): void {
    storageLocal().setItem(this.storageKey, {
      accessToken: payload.accessToken,
      expires: payload.expires,
    } satisfies DevPersistedShape);
  }

  /**
   * 清除 access token
   */
  clear(): void {
    storageLocal().removeItem(this.storageKey);
    Cookies.remove(this.storageKey);
  }

  /**
   * 解析 token
   * @return token
   */
  private resolveToken(): string {
    const fromLs = this.readFromLocalStorage();
    if (fromLs !== '') {
      return fromLs;
    }
    return this.migrateFromLegacyDevCookie();
  }

  /**
   * 从 localStorage 读取 token
   * @return token
   */
  private readFromLocalStorage(): string {
    const raw = storageLocal().getItem<DevPersistedShape>(this.storageKey);
    const token = raw?.accessToken;
    return typeof token === 'string' ? token : '';
  }

  /**
   * 从 legacy dev cookie 迁移 token
   * @return token
   */
  private migrateFromLegacyDevCookie(): string {
    const raw = Cookies.get(this.storageKey);
    if (!raw) {
      return '';
    }
    try {
      const parsed = JSON.parse(raw) as DevPersistedShape;
      const token = parsed.accessToken;
      if (typeof token !== 'string' || token.length === 0) {
        Cookies.remove(this.storageKey);
        return '';
      }
      const expires = typeof parsed.expires === 'number' ? parsed.expires : 0;
      storageLocal().setItem(this.storageKey, { accessToken: token, expires });
      Cookies.remove(this.storageKey);
      return token;
    } catch {
      Cookies.remove(this.storageKey);
      return '';
    }
  }
}

// 应用内唯一的 access token 存储实现（按构建环境选择实现类）
let accessTokenStoreSingleton: AccessTokenReadWriter | null = null;

/**
 * 应用内唯一的 access token 存储实现（按构建环境选择实现类）
 * @returns access token 读写器单例
 */
export function getAccessTokenStore(): AccessTokenReadWriter {
  if (!accessTokenStoreSingleton) {
    accessTokenStoreSingleton = import.meta.env.DEV
      ? new DevLocalStorageAccessTokenStore(TokenKey)
      : new MemoryAccessTokenStore();
  }
  return accessTokenStoreSingleton;
}
