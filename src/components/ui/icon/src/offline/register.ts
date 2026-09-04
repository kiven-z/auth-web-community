import { addIcon } from '@iconify/vue/dist/offline';
import { getSvgInfo } from '@/shared/utils/svg/get-svg-info';

/** 已打包的离线图标键名集合（`集合/图标名`），由各 pack 注册时写入 */
const offlineIconNameSet = new Set<string>();

/** 只读视图，供渲染层判断是否走离线组件 */
export const offlineIconNames: ReadonlySet<string> = offlineIconNameSet;

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
