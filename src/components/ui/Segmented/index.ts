import reSegmented from './src';
import { withInstall } from '@/shared/vue/withInstall';

/** 分段控制器组件 */
export const ReSegmented = withInstall(reSegmented);

export default ReSegmented;
export type { OptionsType } from './src/type';
