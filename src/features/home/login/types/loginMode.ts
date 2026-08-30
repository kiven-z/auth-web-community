import type { Component } from 'vue';

/**
 * 登录方式枚举
 * 新增登录方式时在此处添加枚举值即可，
 */
export enum LoginMode {
  /** 用户名密码 */
  UsernamePassword = 'username-password',
  /** 邮箱 */
  Email = 'email',
  /** 短信 */
  Sms = 'sms',
}

/**
 * 登录方式注册项：对应表单组件（懒加载）。
 * 新增登录方式时在 {@link loginModeRegistry} 追加一条；文案见 useLoginModeOptions。
 */
export interface LoginModeMeta {
  /** 枚举值 */
  mode: LoginMode;
  /** 表单组件懒加载函数 */
  component: () => Promise<{ default: Component }>;
}

/**
 * 登录成功事件
 *
 * 表单组件内部完成登录请求并建立会话后，emit 此事件通知父级做后续导航。
 * 父级不需要知道具体用哪种方式登录，只需要在成功时跳转页面。
 */
export interface LoginFormEmits {
  'login-success': [];
}
