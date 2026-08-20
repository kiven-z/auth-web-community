import type { Emitter } from 'mitt';
import mitt from 'mitt';

/**
 * 全局事件总线类型。
 * layout 相关事件已在 P1 移除（改 store / 响应式 configure）；暂无注册事件。
 */
interface Events {
  [key: string]: unknown;
  [key: symbol]: unknown;
}

export const emitter: Emitter<Events> = mitt<Events>();
