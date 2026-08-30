import type { App } from 'vue';
import { ElLoading } from 'element-plus';

/**
 * 注册 Element Plus 指令（v-loading）。
 * 组件由 Vite 按需注入，勿在此 `app.component` 全量登记。
 */
export function useElementPlus(app: App) {
  app.use(ElLoading);
}
