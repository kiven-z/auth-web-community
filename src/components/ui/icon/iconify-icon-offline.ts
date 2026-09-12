import { addIcon, Icon as IconifyIcon } from '@iconify/vue/dist/offline';
import { defineComponent, h } from 'vue';

// Iconify Icon在Vue里本地使用（用于内网环境）
export default defineComponent({
  name: 'IconifyIconOffline',
  components: { IconifyIcon },
  props: {
    icon: {
      default: null,
    },
  },
  render() {
    if (typeof this.icon === 'object') addIcon(this.icon, this.icon);
    const attrs = this.$attrs;
    if (typeof this.icon === 'string') {
      return h(
        IconifyIcon,
        {
          icon: this.icon,
          'aria-hidden': false,
          style: attrs?.style ? Object.assign(attrs.style, { outline: 'none' }) : { outline: 'none' },
          ...attrs,
        },
        {
          default: () => [],
        }
      );
    } else {
      return h(
        this.icon,
        {
          'aria-hidden': false,
          style: attrs?.style ? Object.assign(attrs.style, { outline: 'none' }) : { outline: 'none' },
          ...attrs,
        },
        {
          default: () => [],
        }
      );
    }
  },
});
