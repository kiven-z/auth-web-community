import { addIcon } from '@iconify/vue/dist/offline';
import { getSvgInfo } from '@/shared/utils/svg/getSvgInfo';
import { offlineIconNameSet } from './nameSet';

/**
 * 将 SVG 原始字符串注册为 Iconify 离线图标，并记入名称白名单
 * @param entries `[键名, SVG 原始内容]` 列表，键名形如 `ri/search-line`；
 *   第二项运行时为 `?raw` 字符串，unplugin-icons 类型仍标成组件故用 unknown
 */
export function registerOfflineIcons(entries: ReadonlyArray<readonly [string, unknown]>): void {
  for (const [name, svg] of entries) {
    addIcon(name, getSvgInfo(svg as string));
    offlineIconNameSet.add(name);
  }
}
