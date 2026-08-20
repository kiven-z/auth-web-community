import { resolve } from 'node:path';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: [resolve(__dirname, './locales/**')],
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@build': resolve(__dirname, 'build'),
    },
  },
  test: {
    environment: 'node',
    include: ['./test/**/*.test.ts'],
    clearMocks: true,
  },
});
