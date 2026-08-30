import { listMyPreferences, upsertMyPreference } from '@/features/system/api/user/userPreferences';
import debounce from 'lodash/debounce';
import type { UiPreferenceKey } from '@/core/config/keysConfig';
import { PREFERENCE_MODULES } from '../registry';

/** 服务端拉取偏好时置位，避免写回循环 */
let isHydrating = false;

/** 是否已开启与服务端的偏好同步 */
let syncStarted = false;

/** 待 upsert 的配置键 */
const pendingKeys = new Set<UiPreferenceKey>();

/** 本会话是否已完成一次服务端 hydrate */
let sessionHydrated = false;

const SYNC_DEBOUNCE_MS = 650;

const moduleByKey = new Map(PREFERENCE_MODULES.map((m) => [m.key, m]));

/**
 * 将当前本地快照 upsert 至服务端
 * @param configKey 配置键
 */
async function flushPreferenceKey(configKey: UiPreferenceKey): Promise<void> {
  const configValue = moduleByKey.get(configKey)?.serialize();
  if (!configValue || Object.keys(configValue).length === 0) {
    return;
  }
  await upsertMyPreference({ configKey, configValue });
}

const debouncedFlush = debounce(async () => {
  if (isHydrating || !syncStarted) {
    return;
  }
  const keys = [...pendingKeys];
  pendingKeys.clear();
  for (const key of keys) {
    try {
      await flushPreferenceKey(key);
    } catch {
      // 网络或鉴权失败时静默，下次变更会再次尝试
    }
  }
}, SYNC_DEBOUNCE_MS);

/**
 * 是否正在从服务端灌入偏好（灌入期间禁止写回）
 * @returns 是否处于 hydrate 中
 */
export function getIsHydrating(): boolean {
  return isHydrating;
}

/**
 * 开启偏好同步（登录后调用）
 */
export function startSync(): void {
  syncStarted = true;
}

/**
 * 停止偏好同步并清空待写队列（登出时调用）
 */
export function stopSync(): void {
  syncStarted = false;
  pendingKeys.clear();
  sessionHydrated = false;
}

/**
 * 本地偏好变更后调度 debounced upsert
 * @param configKey 变更的配置键
 */
export function schedulePreferenceSync(configKey: UiPreferenceKey): void {
  if (isHydrating || !syncStarted) {
    return;
  }
  pendingKeys.add(configKey);
  debouncedFlush();
}

/**
 * 从服务端拉取偏好并覆盖内存态（不触发写回）；成功后回写 Device LS
 * @param applySideEffects 灌入后应用 DOM / store 副作用
 */
export async function hydrateFromServer(applySideEffects?: () => void): Promise<void> {
  isHydrating = true;
  try {
    const response = await listMyPreferences();
    const valueByKey = new Map<string, Record<string, unknown>>();
    for (const item of response.items ?? []) {
      if (item.configValue && typeof item.configValue === 'object' && !Array.isArray(item.configValue)) {
        valueByKey.set(item.configKey, item.configValue);
      }
    }

    for (const module of PREFERENCE_MODULES) {
      const value = valueByKey.get(module.key);
      if (value) {
        module.hydrate(value);
      }
    }

    applySideEffects?.();

    for (const module of PREFERENCE_MODULES) {
      module.mirrorToDevice?.();
    }

    sessionHydrated = true;
  } finally {
    isHydrating = false;
  }
}

/**
 * 本会话是否已完成 hydrate
 * @returns 是否已 hydrate
 */
export function hasSessionHydrated(): boolean {
  return sessionHydrated;
}
