import { injectResponsiveStorage } from '@/app/bootstrap/responsive';
import { useEcharts } from '@/app/plugins/echarts';
import { useElementPlus } from '@/app/plugins/elementPlus';
import { useI18n } from '@/app/plugins/i18n';
import { setupMdEditor } from '@/app/plugins/mdEditor';
import { registerSessionLogout } from '@/auth/config/auth/auth-session-effects';
import { applyHydratedUiPreferences } from '@/core/preferences/runtime/apply';
import { startSystemThemeWatch, syncSystemThemeFromOs } from '@/core/preferences/runtime/system-theme';
import { registerUserProfileSync } from '@/core/session/profile/userProfileSync';
import { setupStore } from '@/store';
import { useUserStore } from '@/store/modules/auth/user';
import { MotionPlugin } from '@vueuse/motion';
import { createApp, type Directive } from 'vue';
import App from './App.vue';
import { getPlatformConfig } from './auth/config';
import router from './router';

import { installDataTable } from '@/components/table/DataTable';
import Description from '@/components/ui/Description';
// 引入重置样式
import './style/reset.scss';
// 导入公共样式（含 --auth-* token；须在 Element 样式之前）
import './style/index.scss';
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import 'element-plus/dist/index.css';
// token → --el-*，必须在 element-plus 默认 CSS 之后，否则会被盖掉
import './style/map-element.scss';
import './style/tailwind.css';
// 导入字体图标
import './assets/iconfont/iconfont.css';
import './assets/iconfont/iconfont.js';
// 自定义指令
import * as directives from '@/app/directives';
// 全局注册@iconify/vue图标库
import { FontIcon, IconifyIconOffline, IconifyIconOnline } from './components/ui/Icon';
// 全局注册按钮级别权限组件
import { Auth, AuthDropdown } from '@/auth/permission';
// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import VueTippy from 'vue-tippy';

setupMdEditor();

const app = createApp(App);

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

app.component('IconifyIconOffline', IconifyIconOffline);
app.component('IconifyIconOnline', IconifyIconOnline);
app.component('FontIcon', FontIcon);

app.component('Auth', Auth);
app.component('AuthDropdown', AuthDropdown);

app.use(VueTippy);

async function bootstrap() {
  try {
    await getPlatformConfig(app);
    // 须在 setupStore / router 之前注入，避免守卫 hydrate 写入未挂载的临时对象
    injectResponsiveStorage(app);
    setupStore(app);
    // 将会话能力桥接到 Pinia（须在 setupStore 之后、首次 setToken 之前）
    registerUserProfileSync((profile) => useUserStore().applyUserProfile(profile));
    registerSessionLogout(() => useUserStore().logOut());
    app.use(router);
    await router.isReady();
    installDataTable(app);
    app.use(MotionPlugin).use(useI18n).use(useElementPlus).use(Description).use(useEcharts);
    applyHydratedUiPreferences();
    syncSystemThemeFromOs();
    startSystemThemeWatch();
    app.mount('#app');
  } catch (error: unknown) {
    console.error('[bootstrap] Application failed to start', error);
    const root = document.querySelector('#app');
    if (root) {
      root.innerHTML =
        '<p style="padding:24px;font-size:14px;color:#606266">应用启动失败，请刷新页面或联系管理员。</p>';
    }
  }
}

void bootstrap();
