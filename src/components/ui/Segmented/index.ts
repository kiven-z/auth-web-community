import SegmentedSrc from './src';
import { withInstall } from '@/shared/vue/withInstall';

/** 分段控制器组件 */
const Segmented = withInstall(SegmentedSrc);

export default Segmented;
export type { OptionsType } from './src/type';
