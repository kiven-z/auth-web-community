import { type ConfigEnv, loadEnv, type UserConfigExport } from 'vite';
import { getPluginsList } from './build/plugins';
import { alias, pathResolve, root, wrapperEnv } from './build/utils';

/**
 * 依赖预构建：冷启动与禁用浏览器缓存时减轻卡顿。
 * monaco-editor 体量大，参与预构建易触发 esbuild 栈溢出，故排除。
 */
const optimizeDepsInclude = [
  'qs',
  'mitt',
  'dayjs',
  'axios',
  'pinia',
  'vue-i18n',
  'vue-types',
  'js-cookie',
  'vue-tippy',
  'sortablejs',
  '@vueuse/core',
];

const optimizeDepsExclude = ['@iconify/json', 'monaco-editor'];

export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH, VITE_PROXY_TARGET } = wrapperEnv(
    loadEnv(mode, root)
  );
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias,
    },
    server: {
      open: true,
      port: VITE_PORT,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '/api'),
        },
      },
      warmup: {
        clientFiles: ['./index.html', './src/components/**/*', './src/features/**/*'],
      },
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION, command === 'serve'),
    optimizeDeps: {
      include: optimizeDepsInclude,
      exclude: optimizeDepsExclude,
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve('./index.html', import.meta.url),
        },
        onwarn(warning, warn) {
          if (warning.code === 'ANNOTATION_POSITION') return;
          warn(warning);
        },
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
    },
  };
};
