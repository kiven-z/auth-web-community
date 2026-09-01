import { LoginMode, type LoginModeMeta } from '@/features/home/login/types/login-mode';
import { type Component, defineAsyncComponent, markRaw } from 'vue';

/**
 * 登录方式注册表（表单组件映射）
 * 新增登录方式时：先在 types/loginMode 中扩展 {@link LoginMode}，再在此处追加一条，
 * 并同步更新 useLoginModeOptions 中的 `t('key')` 文案。
 */
export const loginModeRegistry: LoginModeMeta[] = [
  {
    mode: LoginMode.UsernamePassword,
    component: () => import('../components/UsernamePasswordForm.vue'),
  },
  {
    mode: LoginMode.Email,
    component: () => import('../components/EmailLoginForm.vue'),
  },
  {
    mode: LoginMode.Sms,
    component: () => import('../components/SmsLoginForm.vue'),
  },
];

/** 默认登录方式（注册表第一项） */
const [defaultLoginModeMeta] = loginModeRegistry;
export const defaultLoginMode = defaultLoginModeMeta.mode;

/** 供切换按钮顺序 / 下标查找使用（与注册表同源） */
export const loginModes = loginModeRegistry;

/**
 * 由注册表生成的登录方式 → 表单组件映射。
 */
export const formComponentMap: Record<LoginMode, Component> = loginModeRegistry.reduce(
  (map, item) => {
    map[item.mode] = markRaw(defineAsyncComponent(item.component));
    return map;
  },
  {} as Record<LoginMode, Component>
);
