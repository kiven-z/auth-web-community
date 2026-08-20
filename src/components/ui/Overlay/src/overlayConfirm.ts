import { inject, type InjectionKey } from 'vue';

/** 弹层底部「确定」与内容区回车提交共用此入口 */
export const OVERLAY_CONFIRM_KEY: InjectionKey<() => void> = Symbol('overlayConfirm');

/**
 * 获取当前弹层确定回调；非弹层或未配置 beforeSure 时为 null
 */
export function useOverlayConfirm() {
  return inject(OVERLAY_CONFIRM_KEY, null);
}
