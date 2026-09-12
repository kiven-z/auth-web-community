/** 壳层离线图标注册（ep / ri / systemMenu）；main 引入本包时生效 */
import './offline/load';

export { useRenderIcon } from './hooks';
export type { IconProps } from './types';

export { default as IconSelect } from './icon-select/IconSelect.vue';
