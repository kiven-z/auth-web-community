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
}

export {};
