import { hasAuth } from '@/auth/permission/has-auth';
import type { Directive, DirectiveBinding } from 'vue';

/**
 * 按钮权限指令：无权限时移除元素。
 */
export const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | Array<string>>) {
    const { value } = binding;
    if (value) {
      if (!hasAuth(value)) {
        el.remove();
      }
    } else {
      throw new Error('[Directive: auth]: need auth code! Like v-auth="sys:user:create"');
    }
  },
};
