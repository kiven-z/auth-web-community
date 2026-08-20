import Widget from './src/index.vue';
import { withInstall } from '@/shared/vue/withInstall';

export type { ColumnProps, Row, RowKey, RowKeyProp } from './src/types';

export const Description = withInstall(Widget);
export default Description;
