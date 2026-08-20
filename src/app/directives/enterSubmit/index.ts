import isFunction from 'lodash/isFunction';
import { useEventListener } from '@vueuse/core';
import type { Directive, DirectiveBinding } from 'vue';

/** 回车提交回调（搜索、登录等） */
export type EnterSubmitHandler = () => void | Promise<void>;

/** 挂载了回车提交指令的表单元素 */
export interface EnterSubmitEl extends HTMLElement {
  /** 当前绑定的提交回调 */
  enterSubmitHandler?: EnterSubmitHandler;
}

/**
 * 判断 Enter 是否应忽略（下拉/日期面板/按钮/多行文本等）
 * @param target 事件目标
 * @returns 是否忽略
 */
export function shouldIgnoreEnterTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return true;
  }
  if (target.tagName === 'TEXTAREA') {
    return true;
  }
  if (target.closest('button, .el-button')) {
    return true;
  }
  return Boolean(
    target.closest(
      [
        '.el-select',
        '.el-select-dropdown',
        '.el-cascader',
        '.el-cascader__dropdown',
        '.el-autocomplete',
        '.el-picker-panel',
        '.el-time-panel',
      ].join(', ')
    )
  );
}

/**
 * 表单回车提交指令（列表搜索、登录等）
 *
 * 用法：`v-enter-submit="fetchTableData"` / `v-enter-submit="handleSubmit"`
 *
 * - 拦截 form `submit`，避免浏览器默认整页刷新
 * - 在可输入控件上按 Enter 触发回调；下拉/日期面板/按钮/textarea 不触发
 * @param el 表单根元素
 * @param binding 绑定值须为提交函数
 */
export const enterSubmit: Directive = {
  mounted(el: EnterSubmitEl, binding: DirectiveBinding<EnterSubmitHandler>) {
    const handler = binding.value;
    if (!handler || !isFunction(handler)) {
      throw new Error('[Directive: enterSubmit]: need a function! Like v-enter-submit="handleSubmit"');
    }
    el.enterSubmitHandler = handler;

    useEventListener(el, 'submit', (event: Event) => {
      event.preventDefault();
      el.enterSubmitHandler?.();
    });

    useEventListener(el, 'keydown', (event: KeyboardEvent) => {
      if (event.key !== 'Enter' || event.isComposing) {
        return;
      }
      if (shouldIgnoreEnterTarget(event.target)) {
        return;
      }
      // 阻止原生 submit，避免与 submit 监听重复触发
      event.preventDefault();
      el.enterSubmitHandler?.();
    });
  },
  updated(el: EnterSubmitEl, binding: DirectiveBinding<EnterSubmitHandler>) {
    const handler = binding.value;
    if (!handler || !isFunction(handler)) {
      throw new Error('[Directive: enterSubmit]: need a function! Like v-enter-submit="handleSubmit"');
    }
    el.enterSubmitHandler = handler;
  },
};
