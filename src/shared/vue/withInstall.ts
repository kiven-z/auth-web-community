import type { App, Component, Plugin } from 'vue';

/** 带 Vue 插件 `install` 的 SFC */
export type SfcWithInstall<T> = T & Plugin;

/**
 * 为组件挂上 `install`，支持 `app.use(Comp)` 与 `app.component` 注册。
 * @param main 主组件（须有唯一 `name`）
 * @param extra 额外组件；按传入顺序注册，并挂到主组件同名属性上
 * @returns 带 install 的主组件
 */
export function withInstall<T extends Component, E extends Record<string, Component> = Record<string, never>>(
  main: T,
  extra?: E
): SfcWithInstall<T> & E {
  (main as SfcWithInstall<T>).install = (app: App): void => {
    for (const component of [main, ...Object.values(extra ?? {})]) {
      const name = component.name;
      if (typeof name === 'string' && name.length > 0) {
        app.component(name, component);
      }
    }
  };

  if (extra) {
    for (const [key, component] of Object.entries(extra)) {
      (main as Record<string, Component>)[key] = component;
    }
  }

  return main as SfcWithInstall<T> & E;
}
