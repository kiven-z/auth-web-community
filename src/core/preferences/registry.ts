import type { UiPreferenceKey } from '@/core/config/keys-config';
import { displayModule } from './modules/display-module';
import { layoutModule } from './modules/layout-module';
import { localeModule } from './modules/locale-module';
import { tagsModule } from './modules/tags-module';
import { themeModule } from './modules/theme-module';

/**
 * 单个偏好域的持久化契约：sync 只依赖此接口，不认识具体键与 store。
 */
export interface PreferenceModule<TValue extends Record<string, unknown> = Record<string, unknown>> {
  /** 服务端配置键 */
  key: UiPreferenceKey;
  /** 从 store 取当前值，组装服务端整包 */
  serialize(): TValue;
  /** 服务端值灌入 store（不触发写回） */
  hydrate(value: Partial<TValue>): void;
  /** 内存回到代码默认（不写服务端） */
  resetLocal(): void;
  /** 仅需本机冷启动缓存的域实现（回写 ui-device） */
  mirrorToDevice?(): void;
}

/** 偏好域注册表：新增域在此登记，sync 与白名单据此派生 */
export const PREFERENCE_MODULES: readonly PreferenceModule[] = [
  localeModule,
  themeModule,
  layoutModule,
  displayModule,
  tagsModule,
];
