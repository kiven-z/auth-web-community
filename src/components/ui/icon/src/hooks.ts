import { type Component, defineComponent, h } from 'vue';
import FontIcon from './iconfont';
import IconifyIconOffline from './iconify-icon-offline';
import IconifyIconOnline from './iconify-icon-online';
import { offlineIconNames } from './offline';
import type { IconProps } from './types';

/**
 * 支持 `iconfont`、自定义 `svg` 以及 `iconify` 离线/在线图标
 * @param icon 图标
 * @param attrs IconProps 属性
 * @returns Component
 */
export function useRenderIcon(icon: any, attrs?: IconProps): Component {
  // typeof icon === "function" 属于SVG
  if (typeof icon === 'string' && icon.startsWith('IF-')) {
    // iconfont
    const name = icon.slice('IF-'.length);
    const spaceIndex = name.indexOf(' ');
    const iconName = spaceIndex === -1 ? name : name.slice(0, spaceIndex);
    const iconType = spaceIndex === -1 ? '' : name.slice(spaceIndex + 1);
    return defineComponent({
      name: 'FontIcon',
      render() {
        return h(FontIcon, {
          icon: iconName,
          iconType,
          ...attrs,
        });
      },
    });
  } else if (typeof icon === 'function' || typeof icon?.render === 'function') {
    // svg
    return attrs ? h(icon, { ...attrs }) : icon;
  } else if (typeof icon === 'object') {
    return defineComponent({
      name: 'OfflineIcon',
      render() {
        return h(IconifyIconOffline, {
          icon: icon,
          ...attrs,
        });
      },
    });
  } else {
    // 已打包离线键走 Offline；否则转在线键名走 CDN
    return defineComponent({
      name: 'Icon',
      render() {
        if (!icon) return;
        const offlineName = String(icon).replace(':', '/');
        if (offlineIconNames.has(offlineName)) {
          return h(IconifyIconOffline, {
            icon: offlineName,
            ...attrs,
          });
        }
        return h(IconifyIconOnline, {
          icon: offlineName.replace('/', ':'),
          ...attrs,
        });
      },
    });
  }
}
