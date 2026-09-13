import { ACCESS_TOKEN_STORAGE_KEY } from '@/core/config/keys-config';
import { storageLocal } from '@/core/storage/storage-local';

/** 写入 access token 时的字段；expires 为毫秒时间戳 */
interface AccessTokenStorePayload {
  accessToken: string;
  expires: number;
}

/** 访问令牌读写：生产内存，开发 localStorage */
interface AccessTokenReadWriter {
  /** 当前 accessToken，没有则空串 */
  get(): string;

  /** 是否存在非空 accessToken */
  has(): boolean;

  /**
   * 设置 access token
   * @param payload 负载
   */
  set(payload: AccessTokenStorePayload): void;

  /** 清除 access token */
  clear(): void;
}

/** 生产环境：accessToken 仅驻留内存，刷新后依赖刷新令牌恢复 */
class MemoryAccessTokenStore implements AccessTokenReadWriter {
  private accessToken = '';

  get(): string {
    return this.accessToken;
  }

  has(): boolean {
    return this.accessToken.length > 0;
  }

  set(payload: AccessTokenStorePayload): void {
    this.accessToken = payload.accessToken;
  }

  clear(): void {
    this.accessToken = '';
  }
}

interface DevPersistedShape {
  accessToken?: string;
  /** 过期时间戳 */
  expires?: number;
}

/** 开发环境：accessToken 持久化到 localStorage，减轻 Vite HMR 清空内存导致的误登出 */
class DevLocalStorageAccessTokenStore implements AccessTokenReadWriter {
  constructor(private readonly storageKey: string) {}

  get(): string {
    return this.readFromLocalStorage();
  }

  has(): boolean {
    return this.readFromLocalStorage().length > 0;
  }

  set(payload: AccessTokenStorePayload): void {
    storageLocal().setItem(this.storageKey, {
      accessToken: payload.accessToken,
      expires: payload.expires,
    } satisfies DevPersistedShape);
  }

  clear(): void {
    storageLocal().removeItem(this.storageKey);
  }

  private readFromLocalStorage(): string {
    const raw = storageLocal().getItem<DevPersistedShape>(this.storageKey);
    const token = raw?.accessToken;
    return typeof token === 'string' ? token : '';
  }
}

let accessTokenStoreSingleton: AccessTokenReadWriter | null = null;

/**
 * 应用内唯一的 access token 存储，按 DEV/PROD 选择实现
 * @returns access token 读写器单例
 */
export function getAccessTokenStore(): AccessTokenReadWriter {
  if (!accessTokenStoreSingleton) {
    accessTokenStoreSingleton = import.meta.env.DEV
      ? new DevLocalStorageAccessTokenStore(ACCESS_TOKEN_STORAGE_KEY)
      : new MemoryAccessTokenStore();
  }
  return accessTokenStoreSingleton;
}
