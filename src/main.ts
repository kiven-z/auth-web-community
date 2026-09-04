import { useElementPlus } from '@/app/plugins/element-plus';
import { useI18n } from '@/app/plugins/i18n';
import { applyHydratedUiPreferences } from '@/core/preferences/runtime/apply';
import { useThemePreferencesStore } from '@/store/modules/preferences/theme-preferences';
import { registerSessionLogout } from '@/core/session/session-logout';
import { registerUserProfileSync } from '@/core/session/profile/user-profile-sync';
import { setupStore } from '@/store';
import { useUserStore } from '@/store/modules/auth/user';
import { MotionPlugin } from '@vueuse/motion';
import { createApp, type Directive } from 'vue';
import App from './App.vue';
import router from './router';

import { installDataTable } from '@/components/table/data-table';
import Description from '@/components/ui/description';
// 引入重置样式
import './style/reset.scss';
// 导入公共样式（含 --auth-* token；须在 Element 样式之前）
import './style/index.scss';
// 一定要在 main.ts 导入 tailwind.css，避免 HMR 打到 index.scss 整体 CSS
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
import { FontIcon, IconifyIconOffline, IconifyIconOnline } from './components/ui/icon';
// 全局注册按钮级别权限组件
import { Auth, AuthDropdown } from '@/auth/permission';
// 全局注册vue-tippy
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import VueTippy from 'vue-tippy';

const app = createApp(App);

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

app.component('IconifyIconOffline', IconifyIconOffline);
app.component('IconifyIconOnline', IconifyIconOnline);
app.component('FontIcon', FontIcon);

app.component('auth', Auth);
app.component('AuthDropdown', AuthDropdown);

app.use(VueTippy);

async function bootstrap() {
  try {
    setupStore(app);
    // 将会话能力桥接到 Pinia（须在 setupStore 之后、首次 setToken 之前）
    registerUserProfileSync((profile) => useUserStore().applyUserProfile(profile));
    registerSessionLogout(() => useUserStore().logOut());
    app.use(router);
    await router.isReady();
    installDataTable(app);
    app.use(MotionPlugin).use(useI18n).use(useElementPlus).use(Description);
    applyHydratedUiPreferences();
    useThemePreferencesStore().$startSystemThemeWatch();
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
