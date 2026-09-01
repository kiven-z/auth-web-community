import Widget from './src/index.vue';
import { withInstall } from '@/shared/vue/with-install';

export type { ColumnProps } from './src/types';

export const Description = withInstall(Widget);
export default Description;
