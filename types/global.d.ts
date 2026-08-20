/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /** 表格单元格 render 上下文 */
  interface TableColumnRenderContext<T = any> {
    row: T;
    value: unknown;
    index: number;
    column: TableColumns;
  }

  /**
   * 表格列定义（DataTable、ListTable 列配置共用）
   */
  interface TableColumns {
    type?: 'selection' | 'index' | 'expand';
    label?: string;
    prop?: string;
    width?: number | string;
    minWidth?: number | string;
    fixed?: boolean | 'left' | 'right';
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
    hide?: boolean | ((row?: unknown) => boolean);
    showOverflowTooltip?: boolean | Record<string, unknown>;
    /** 函数渲染；与 slot 同时存在时优先 render */
    render?: (ctx: TableColumnRenderContext) => unknown;
    /** 表头渲染 */
    headerRender?: () => unknown;
    /** 具名插槽，由使用方 `<template #name>` 提供 */
    slot?: string;
    index?: (index: number) => number;
    children?: TableColumns[];
    sortable?: boolean | 'custom';
    [key: string]: unknown;
  }

  type TableColumnList = TableColumns[];

  /**
   * Window 的类型提示
   */
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;
  }

  /**
   * Document 的类型提示
   */
  interface Document {
    webkitFullscreenElement?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
  }

  /**
   * 打包压缩格式的类型声明
   */
  type ViteCompression = 'none' | 'gzip' | 'brotli' | 'both' | 'gzip-clear' | 'brotli-clear' | 'both-clear';

  /**
   * 全局自定义环境变量的类型声明
   */
  interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_PROXY_TARGET: string;
    VITE_CDN: boolean;
    VITE_HIDE_HOME: string;
    VITE_COMPRESSION: ViteCompression;
  }

  /**
   * 对应 `public/platform-config.json`：仅部署/产品壳配置（不含用户偏好出厂默认）
   */
  interface PlatformConfigs {
    Title?: string;
    FixedHeader?: boolean;
    HiddenSideBar?: boolean;
    MaxTagsLevel?: number;
    KeepAlive?: boolean;
    MenuArrowIconNoTransition?: boolean;
    CachingAsyncRoutes?: boolean;
    TooltipEffect?: Effect;
    ResponsiveStorageNameSpace?: string;
    MenuSearchHistory?: number;
  }

  /**
   * 与 `PlatformConfigs` 类型不同，这里是缓存到浏览器本地存储的类型声明
   */
  interface StorageConfigs {
    title?: string;
    fixedHeader?: boolean;
    hiddenSideBar?: boolean;
    multiTagsCache?: boolean;
    keepAlive?: boolean;
    locale?: string;
    layout?: string;
    navTheme?: string;
    colorScheme?: string;
    grey?: boolean;
    weak?: boolean;
    hideTabs?: boolean;
    hideFooter?: boolean;
    sidebarStatus?: boolean;
    primaryColor?: string;
    showLogo?: boolean;
    showModel?: string;
    menuSearchHistory?: number;
    username?: string;
  }

  /**
   * UI 偏好内存态（locale / layout / configure / tags）；持久化只走服务端，不落 localStorage
   */
  interface ResponsiveStorage {
    locale: {
      locale?: string;
    };
    layout: {
      /** vertical / horizontal / mix */
      layout?: 'vertical' | 'horizontal' | 'mix';
      /** 侧栏皮肤偏好（暗色下 light 仅在 apply 时回落，不改写本字段） */
      navTheme?: string;
      /** light / dark / system */
      colorScheme?: string;
      sidebarStatus?: boolean;
      /** Element 主色，与侧栏白皮肤解耦 */
      primaryColor?: string;
    };
    configure: {
      grey?: boolean;
      weak?: boolean;
      hideTabs?: boolean;
      hideFooter?: boolean;
      showLogo?: boolean;
      showModel?: string;
      /** 是否将打开的标签同步到服务端（跨浏览器恢复） */
      multiTagsCache?: boolean;
      stretch?: boolean | number;
    };
    /** 多标签快照（仅在开启 multiTagsCache 时与服务端 ui.tags 同步） */
    tags?: Array<Record<string, unknown>>;
  }
}

export {};
