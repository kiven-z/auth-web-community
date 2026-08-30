import { listMyPreferences, upsertMyPreference } from '@/features/system/api/user/user-preferences';
import debounce from 'lodash/debounce';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import { UI_PREFERENCE_KEYS, type UiPreferenceKey } from './keys';
import {
  getConfigureSnapshot,
  getLayoutSnapshot,
  getTagsSnapshot,
  patchConfigure,
  patchLayout,
  replaceTags,
} from './storage';
import { buildTagsPreferenceValue, parseTagsPreferenceValue } from './tags';

/** 服务端拉取偏好时置位，避免写回循环 */
let isHydrating = false;

/** 是否已开启与服务端的偏好同步 */
let syncStarted = false;

/** 待 upsert 的配置键 */
const pendingKeys = new Set<UiPreferenceKey>();

/** 本会话是否已完成一次服务端 hydrate */
let sessionHydrated = false;

const SYNC_DEBOUNCE_MS = 650;

/** layout 中可与服务端往返的壳字段（主题走 Device LS） */
const ACCOUNT_LAYOUT_KEYS = ['layout', 'sidebarStatus'] as const;

/**
 * 将单条服务端偏好写入内存态（不触发 upsert；不覆盖本机语言/主题）
 * @param configKey 配置键
 * @param configValue 配置值对象
 */
function applyServerPreference(configKey: string, configValue: Record<string, unknown>): void {
  switch (configKey) {
    case UI_PREFERENCE_KEYS.LAYOUT:
      patchLayout(omitBy(pick(configValue, ACCOUNT_LAYOUT_KEYS), isUndefined) as Partial<ResponsiveStorage['layout']>);
      break;
    case UI_PREFERENCE_KEYS.CONFIGURE:
      patchConfigure(configValue);
      break;
    case UI_PREFERENCE_KEYS.TAGS:
      replaceTags(parseTagsPreferenceValue(configValue));
      break;
    default:
      break;
  }
}

/**
 * 将当前本地快照 upsert 至服务端
 * @param configKey 配置键
 */
async function flushPreferenceKey(configKey: UiPreferenceKey): Promise<void> {
  let configValue: Record<string, unknown>;
  switch (configKey) {
    case UI_PREFERENCE_KEYS.LAYOUT:
      configValue = omitBy(pick(getLayoutSnapshot(), ACCOUNT_LAYOUT_KEYS), isUndefined);
      break;
    case UI_PREFERENCE_KEYS.CONFIGURE:
      configValue = { ...getConfigureSnapshot() };
      break;
    case UI_PREFERENCE_KEYS.TAGS:
      configValue = { ...buildTagsPreferenceValue(getTagsSnapshot()) };
      break;
    default:
      return;
  }

  if (Object.keys(configValue).length === 0) {
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
 * 从服务端拉取偏好并覆盖内存态（不触发写回；不覆盖本机语言/主题）
 * @param applySideEffects 灌入后应用 DOM / store 副作用
 */
export async function hydrateFromServer(applySideEffects?: () => void): Promise<void> {
  isHydrating = true;
  try {
    const response = await listMyPreferences();
    for (const item of response.items ?? []) {
      if (item.configValue && typeof item.configValue === 'object' && !Array.isArray(item.configValue)) {
        applyServerPreference(item.configKey, item.configValue);
      }
    }
    applySideEffects?.();
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
