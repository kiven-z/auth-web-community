/**
 * 页面组件 glob 扫描路径配置。
 *
 * 后端动态路由返回的 component 路径会与这里扫描到的文件进行匹配，
 * 匹配成功后将懒加载组件注入路由。
 *
 * 如需新增页面组件扫描目录，在此文件追加 glob 模式即可。
 *
 * @see https://cn.vitejs.dev/guide/features.html#glob-import
 */
export const modulesRoutes = import.meta.glob(['/src/features/**/*.{vue,tsx}']);

export const modulesRoutesKeys = Object.keys(modulesRoutes);
