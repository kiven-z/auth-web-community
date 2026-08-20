import { hasAuth } from './hasAuth';
import type { AuthCode, AuthMode } from './types';
import { defineComponent, Fragment, type PropType } from 'vue';

/**
 * 按权限码控制插槽是否渲染。
 * 无权限时不渲染默认插槽。
 */
export default defineComponent({
  name: 'Auth',
  props: {
    code: {
      type: [String, Array] as PropType<AuthCode>,
      required: true,
    },
    mode: {
      type: String as PropType<AuthMode>,
      default: 'all',
    },
  },
  setup(props, { slots }) {
    return () => {
      if (!slots.default) {
        return null;
      }
      return hasAuth(props.code, props.mode) ? <Fragment>{slots.default()}</Fragment> : null;
    };
  },
});
