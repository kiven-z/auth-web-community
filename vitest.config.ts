import { resolve } from 'node:path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { defineConfig } from 'vitest/config';

const rootDir = import.meta.dirname;

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    VueI18nPlugin({
      include: [resolve(rootDir, './locales/**')],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(rootDir, './src'),
      '@build': resolve(rootDir, 'build'),
    },
  },
  test: {
    environment: 'node',
    include: ['./test/**/*.test.ts'],
    clearMocks: true,
  },
});
