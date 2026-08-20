/**
 * 带自动 JSON 序列化的 localStorage 读写接口：set 时 stringify，get 时 parse。
 */
export interface StorageLocalApi {
  /**
   * 读取并反序列化键值
   * @param key 存储键
   * @returns 解析后的值；键不存在或 JSON 损坏时返回 null
   */
  getItem<T>(key: string): T | null;

  /**
   * 序列化并写入键值
   * @param key 存储键
   * @param value 任意可 JSON 序列化的值
   */
  setItem<T>(key: string, value: T): void;

  /**
   * 删除单个键
   * @param key 存储键
   */
  removeItem(key: string): void;

  /** 清空当前域下全部 localStorage */
  clear(): void;
}

/**
 * 获取浏览器 localStorage；不可用时返回 null
 * @returns 原生 Storage，或不可用时为 null
 */
function resolveNativeLocalStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    // 隐私模式等可能抛 SecurityError
    return null;
  }
}

/**
 * 返回 localStorage JSON 代理（每次调用返回新对象，方法无状态）
 * @returns 读写 API
 */
export function storageLocal(): StorageLocalApi {
  const storage = resolveNativeLocalStorage();

  return {
    getItem<T>(key: string): T | null {
      if (!storage) {
        return null;
      }
      const raw = storage.getItem(key);
      if (raw === null) {
        return null;
      }
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    },

    setItem<T>(key: string, value: T): void {
      if (!storage) {
        return;
      }
      storage.setItem(key, JSON.stringify(value));
    },

    removeItem(key: string): void {
      storage?.removeItem(key);
    },

    clear(): void {
      storage?.clear();
    },
  };
}
