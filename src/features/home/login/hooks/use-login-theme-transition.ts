import type { Ref } from 'vue';
import { nextTick, ref } from 'vue';

/**
 * 是否支持圆形剪裁主题过渡（View Transitions API，且未开启减弱动效）
 */
function canUseThemeTransition(): boolean {
  return (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * 按触发点中心写入圆形过渡 CSS 变量与方向标记（Element Plus 文档站同款算法）
 * @param originEl 过渡圆心所在节点
 * @param toLight 是否切向浅色
 */
function prepareThemeTransitionVars(originEl: HTMLElement, toLight: boolean): void {
  const rect = originEl.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

  // circle() 百分比基准为 sqrt(w²+h²)/√2，避免页面缩放时圆心偏移
  const ratioX = (100 * x) / innerWidth;
  const ratioY = (100 * y) / innerHeight;
  const referR = Math.hypot(innerWidth, innerHeight) / Math.SQRT2;
  const ratioR = (100 * endRadius) / referR;

  const root = document.documentElement;
  root.dataset.themeTransition = toLight ? 'to-light' : 'to-dark';
  root.style.setProperty('--theme-transition-x', `${ratioX}%`);
  root.style.setProperty('--theme-transition-y', `${ratioY}%`);
  root.style.setProperty('--theme-transition-radius', `${ratioR}%`);
}

/**
 * 清理过渡标记与 CSS 变量
 */
function clearThemeTransitionVars(): void {
  const root = document.documentElement;
  delete root.dataset.themeTransition;
  root.style.removeProperty('--theme-transition-x');
  root.style.removeProperty('--theme-transition-y');
  root.style.removeProperty('--theme-transition-radius');
}

/**
 * 登录页亮暗切换：圆形 clip-path 全屏过渡（图标点击触发）
 * @param dataTheme 当前是否深色（切换前的值）
 * @param applyTheme 在 View Transition 回调内应用主题（写 storage + DOM）；调用前 dataTheme 已翻转
 */
export function useLoginThemeTransition(dataTheme: Ref<boolean>, applyTheme: () => void) {
  const themeToggleRef = ref<HTMLElement>();
  let latestTransitionId = 0;
  let transitioning = false;

  /**
   * 翻转 dataTheme 并落盘 / 同步 DOM
   */
  function commitThemeToggle(): void {
    dataTheme.value = !dataTheme.value;
    applyTheme();
  }

  /**
   * 点击主题图标：有 View Transition 时先铺垫再切换；否则直接切换
   */
  function onThemeToggle(): void {
    if (transitioning) {
      return;
    }

    if (!canUseThemeTransition()) {
      commitThemeToggle();
      return;
    }

    const originEl = themeToggleRef.value;
    if (!originEl) {
      commitThemeToggle();
      return;
    }

    // dataTheme 尚未翻转：true(深) → 切浅；false(浅) → 切深
    prepareThemeTransitionVars(originEl, dataTheme.value);
    const transitionId = ++latestTransitionId;
    transitioning = true;

    const transition = document.startViewTransition(async () => {
      commitThemeToggle();
      await nextTick();
    });

    transition.finished.finally(() => {
      transitioning = false;
      if (transitionId !== latestTransitionId) {
        return;
      }
      clearThemeTransitionVars();
    });
  }

  return {
    themeToggleRef,
    onThemeToggle,
  };
}
