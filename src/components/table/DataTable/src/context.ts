import type { InjectionKey, Slots } from 'vue';

/** DataTable 根插槽，供列组件解析 `slot: 'actions'` 等 */
export const DATA_TABLE_SLOTS_KEY: InjectionKey<Slots> = Symbol('dataTableSlots');
