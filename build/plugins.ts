import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer } from 'rollup-plugin-visualizer';
import ElementPlusStyle from 'unplugin-element-plus/vite';
import Icons from 'unplugin-icons/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import type { PluginOption } from 'vite';
import { vitePluginFakeServer } from 'vite-plugin-fake-server';
import removeConsole from 'vite-plugin-remove-console';
import VueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';
import { cdn } from './cdn';
import { configCompressPlugin } from './compress';
import { pathResolve } from './utils';

import monacoEditorPluginImport from 'vite-plugin-monaco-editor';

const monacoEditorPlugin =
  typeof monacoEditorPluginImport === 'function'
    ? monacoEditorPluginImport
    : (monacoEditorPluginImport as { default: typeof monacoEditorPluginImport }).default;

export function getPluginsList(VITE_CDN: boolean, VITE_COMPRESSION: ViteCompression, isDev: boolean): PluginOption[] {
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    tailwindcss(),
    vue(),
    isDev ? VueDevTools() : null,
    vueJsx(),
    /**
     * Element Plus 按需：模板里的 el-* 解析到对应组件与样式；
     * 不扫 src/components，避免把本仓组件做成隐式全局。
     */
    Components({
      dirs: [],
      dts: false,
      include: [/\.vue($|\?)/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'css',
          directives: false,
        }),
      ],
    }),
    /** 脚本 `import { ElTag } from 'element-plus'` 时补对应 CSS */
    ElementPlusStyle({ useSource: false }),
    VueI18nPlugin({
      include: [pathResolve('../locales/**')],
    }),
    /**
     * Monaco：在 index.html 注入 MonacoEnvironment.getWorkerUrl，并在构建产物中写入 monacoeditorwork/。
     * 勿在业务里再挂 getWorker（会覆盖 getWorkerUrl）。
     */
    monacoEditorPlugin({
      customWorkers: [],
      languageWorkers: ['editorWorkerService', 'html', 'json'],
      publicPath: 'monacoeditorwork',
      globalAPI: false,
    }),
    isDev
      ? vitePluginFakeServer({
          logger: false,
          include: 'mock',
          infixName: false,
          enableProd: false,
        })
      : null,
    svgLoader(),
    Icons({
      compiler: 'vue3',
      scale: 1,
    }),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    removeConsole({ external: ['src/assets/iconfont/iconfont.js'] }),
    lifecycle === 'report' ? visualizer({ open: true, brotliSize: true, filename: 'report.html' }) : (null as any),
  ];
}
