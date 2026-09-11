import { convertParsedSVG, parseSVGContent } from '@iconify/utils';
import { addIcon } from '@iconify/vue/dist/offline';

/** 已打包的离线图标键名集合（`集合/图标名`），由各 pack 注册时写入 */
const offlineIconNameSet = new Set<string>();

/** 只读视图，供渲染层判断是否走离线组件 */
export const offlineIconNames: ReadonlySet<string> = offlineIconNameSet;

/**
 * 注册离线图标并记入名称集合
 * @param entries 键名与 SVG 原始内容的列表
 */
export function registerOfflineIcons(entries: ReadonlyArray<readonly [string, unknown]>): void {
  for (const [name, svg] of entries) {
    const parsed = parseSVGContent(svg as string);
    const icon = parsed ? convertParsedSVG(parsed) : undefined;
    if (!icon) {
      continue;
    }
    addIcon(name, icon);
    offlineIconNameSet.add(name);
  }
}
