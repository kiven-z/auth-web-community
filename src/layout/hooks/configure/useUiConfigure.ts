import { applyConfigureSideEffects } from '@/core/preferences/runtime/apply';
import { patchConfigure } from '@/core/preferences/persistence/storage';

/** configure 局部字段补丁 */
type ConfigurePatch = Partial<ResponsiveStorage['configure']>;

/**
 * 合并写入 configure；对 grey / weak / multiTagsCache 等应用 DOM 与 store 副作用
 * @param patch 待合并字段
 */
export function patchConfigureField(patch: ConfigurePatch): void {
  patchConfigure(patch);
  applyConfigureSideEffects(patch);
}
