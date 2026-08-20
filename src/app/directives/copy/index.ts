import { copyToClipboard } from '@/shared/utils/clipboard';
import { useEventListener } from '@vueuse/core';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * 复制元素
 */
export interface CopyEl extends HTMLElement {
  copyValue: string;
}

/**
 * 文本复制指令（默认双击复制）
 * @param el 元素
 * @param binding 绑定
 */
export const copy: Directive = {
  mounted(el: CopyEl, binding: DirectiveBinding<string>) {
    el.copyValue = binding.value ?? '';
    const arg = binding.arg ?? 'dblclick';
    useEventListener(el, arg, () => {
      copyToClipboard(el.copyValue);
    });
  },
  updated(el: CopyEl, binding: DirectiveBinding) {
    el.copyValue = binding.value ?? '';
  },
};
