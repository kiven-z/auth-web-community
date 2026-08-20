import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import throttle from 'lodash/throttle';
import { useEventListener } from '@vueuse/core';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * 优化选项
 */
export interface OptimizeOptions {
  /** 事件名 */
  event: string;
  /** 事件触发的方法 */
  fn: (...params: any) => any;
  /** 是否立即执行 */
  immediate?: boolean;
  /** 防抖或节流的延迟时间（防抖默认 200ms，节流默认 1000ms） */
  timeout?: number;
  /** 传递给 `fn` 的参数 */
  params?: any;
}

const OPTIMIZE_TYPES = ['debounce', 'throttle'] as const;
type OptimizeType = (typeof OPTIMIZE_TYPES)[number];

function isOptimizeType(value: string): value is OptimizeType {
  return (OPTIMIZE_TYPES as readonly string[]).includes(value);
}

/** 将指令 params 规范为可展开的参数列表 */
function normalizeParams(params: unknown): unknown[] | undefined {
  if (!params) {
    return undefined;
  }
  if (!(isArray(params) || isObject(params))) {
    throw new Error('[Directive: optimize]: `params` must be an array or object');
  }
  return isObject(params) ? Array.of(params) : (params as unknown[]);
}

function createOptimizedListener(type: OptimizeType, value: OptimizeOptions) {
  const params = normalizeParams(value?.params);
  const handler = params ? () => value.fn(...params) : value.fn;
  if (type === 'debounce') {
    return debounce(handler, value?.timeout ?? 200, value?.immediate ? { leading: true, trailing: false } : {});
  }
  return throttle(handler, value?.timeout ?? 1000);
}

/**
 * 防抖（v-optimize或v-optimize:debounce）、节流（v-optimize:throttle）指令
 */
export const optimize: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<OptimizeOptions>) {
    const { value } = binding;
    const optimizeType = binding.arg ?? 'debounce';
    if (!isOptimizeType(optimizeType)) {
      throw new Error('[Directive: optimize]: only `debounce` and `throttle` are supported');
    }
    if (!value?.event || !isFunction(value.fn)) {
      throw new Error('[Directive: optimize]: `event` and `fn` are required, and `fn` must be a function');
    }
    useEventListener(el, value.event, createOptimizedListener(optimizeType, value));
  },
};
