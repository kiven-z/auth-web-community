/** 壳层离线图标注册（ep / ri / systemMenu）；main 引入本包时生效 */
import './src/offline/load';

export { useRenderIcon } from './src/hooks';
export type { IconProps } from './src/types';

export { default as IconSelect } from './src/icon-select/IconSelect.vue';
