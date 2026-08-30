import { getResponsiveStorage } from '@/app/bootstrap/responsive';
import type { RouteConfigs } from '@/layout/types';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import pick from 'lodash/pick';
import { writeDeviceUiPreferences } from './device-storage';
import { UI_PREFERENCE_KEYS } from './keys';
import { getIsHydrating, schedulePreferenceSync } from './sync';
import { toPersistedTag } from './tags';

/**
 * 获取 UI 偏好内存态
 * @returns 响应式 storage
 */
function getStorage(): ResponsiveStorage {
  return getResponsiveStorage();
}

/**
 * 供 layout / App 读取的响应式偏好根对象
 * 组件应通过本函数 + computed 读偏好，禁止再 useGlobal().$storage
 * @returns 响应式 locale / layout / configure / tags
 */
export function getUiPreferenceState(): ResponsiveStorage {
  return getStorage();
}

/**
 * 浅比较两个偏好对象是否一致（键集合与各值严格相等）
 * @param left 左侧对象
 * @param right 右侧对象
 * @returns 是否浅相等
 */
function isShallowEqualRecord(left: Record<string, unknown>, right: Record<string, unknown>): boolean {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  return leftKeys.every((key) => left[key] === right[key]);
}

/**
 * 读取当前 locale 快照
 * @returns locale 配置
 */
export function getLocaleSnapshot(): ResponsiveStorage['locale'] {
  return { ...getStorage().locale };
}

/**
 * 读取当前 layout 快照
 * @returns layout 配置
 */
export function getLayoutSnapshot(): ResponsiveStorage['layout'] {
  return { ...getStorage().layout };
}

/**
 * 读取当前 configure 快照
 * @returns configure 配置
 */
export function getConfigureSnapshot(): ResponsiveStorage['configure'] {
  return { ...getStorage().configure };
}

/**
 * 读取当前多标签快照（已规范化）
 * @returns 标签列表
 */
export function getTagsSnapshot(): RouteConfigs[] {
  const tags = getStorage().tags;
  if (!Array.isArray(tags)) {
    return [];
  }
  return tags.map((tag) => toPersistedTag(tag as RouteConfigs));
}

/**
 * 合并写入 locale，并落盘 Device LS（不经服务端）
 * @param patch 待合并字段
 */
export function patchLocale(patch: Partial<ResponsiveStorage['locale']>): void {
  const $storage = getStorage();
  const next = { ...$storage.locale, ...patch };
  if (isShallowEqualRecord($storage.locale, next)) {
    return;
  }
  $storage.locale = next;
  if (!getIsHydrating() && next.locale !== undefined) {
    writeDeviceUiPreferences({ locale: next.locale });
  }
}

/**
 * 合并写入 layout：主题字段落 Device LS；壳字段可调度服务端同步
 * @param patch 待合并字段
 */
export function patchLayout(patch: Partial<ResponsiveStorage['layout']>): void {
  const $storage = getStorage();
  const next = { ...$storage.layout, ...patch };
  if (isShallowEqualRecord($storage.layout, next)) {
    return;
  }
  $storage.layout = next;
  if (getIsHydrating()) {
    return;
  }

  /** layout 中归属本机的主题字段 */
  const deviceLayoutKeys = ['colorScheme', 'navTheme', 'primaryColor'] as const;
  const devicePatch = omitBy(pick(patch, deviceLayoutKeys), isUndefined);
  if (Object.keys(devicePatch).length > 0) {
    writeDeviceUiPreferences(devicePatch);
  }

  if (patch.layout !== undefined || patch.sidebarStatus !== undefined) {
    schedulePreferenceSync(UI_PREFERENCE_KEYS.LAYOUT);
  }
}

/**
 * 合并写入 configure 并调度同步
 * @param patch 待合并字段
 */
export function patchConfigure(patch: Partial<ResponsiveStorage['configure']>): void {
  const $storage = getStorage();
  const next = { ...$storage.configure, ...patch };
  if (isShallowEqualRecord($storage.configure, next)) {
    return;
  }
  $storage.configure = next;
  if (!getIsHydrating()) {
    schedulePreferenceSync(UI_PREFERENCE_KEYS.CONFIGURE);
  }
}

/**
 * 覆盖写入多标签内存快照；开启「记住标签」时调度服务端同步
 * @param tags 标签列表
 */
export function replaceTags(tags: RouteConfigs[]): void {
  const state = getStorage();
  state.tags = tags.map(toPersistedTag) as ResponsiveStorage['tags'];
  if (!getIsHydrating() && state.configure.multiTagsCache) {
    schedulePreferenceSync(UI_PREFERENCE_KEYS.TAGS);
  }
}

/**
 * 重置内存中的 UI 偏好（不触发服务端同步、不改 Device LS）
 * @param defaults 默认 locale / layout / configure / tags
 */
export function resetLocalUiPreferences(defaults: {
  locale: ResponsiveStorage['locale'];
  layout: ResponsiveStorage['layout'];
  configure: ResponsiveStorage['configure'];
  tags?: RouteConfigs[];
}): void {
  const state = getStorage();
  state.locale = { ...defaults.locale };
  state.layout = { ...defaults.layout };
  state.configure = { ...defaults.configure };
  state.tags = [...(defaults.tags ?? [])] as ResponsiveStorage['tags'];
}
