import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

/**
 * 安装 Pinia。SPA 下安装后即可直接调用 useXxxStore()，无需再传 pinia 实例。
 * @param app Vue 应用实例
 */
export function setupStore(app: App<Element>) {
  app.use(store);
}
