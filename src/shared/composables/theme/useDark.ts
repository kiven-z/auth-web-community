import { onBeforeMount, onBeforeUnmount, shallowRef, type ShallowRef } from 'vue';

/** useDark 可选配置 */
export interface UseDarkOptions {
  /** 监听节点选择器，默认 html */
  selector?: 'html' | 'body';
  /** 判定暗色的 class 名，默认 dark */
  className?: string;
}

/** useDark 返回值 */
export interface UseDarkReturn {
  /** 当前是否暗色 */
  isDark: ShallowRef<boolean>;
  /** 切换暗色 class */
  toggleDark: () => void;
}

/**
 * 监听根节点 class 判断应用是否处于暗色主题（与 preferences 写入的 html.dark 同步）
 * @param options selector / className
 * @returns isDark、toggleDark
 */
export function useDark(options?: UseDarkOptions): UseDarkReturn {
  const className = options?.className ?? 'dark';
  const isDark = shallowRef(false);
  let mutationObserver: MutationObserver | undefined;

  function resolveRoot(): HTMLElement {
    return options?.selector === 'body' ? document.body : document.documentElement;
  }

  function syncFromDom(): void {
    isDark.value = resolveRoot().classList.contains(className);
  }

  function toggleDark(): void {
    resolveRoot().classList.toggle(className);
  }

  onBeforeMount(() => {
    const root = resolveRoot();
    syncFromDom();
    mutationObserver = new MutationObserver(syncFromDom);
    mutationObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
  });

  onBeforeUnmount(() => {
    mutationObserver?.disconnect();
    mutationObserver = undefined;
  });

  return { isDark, toggleDark };
}
