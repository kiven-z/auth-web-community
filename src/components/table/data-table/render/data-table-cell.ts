import { defineComponent } from 'vue';

/**
 * 将任意单元格结果（VNode / 文本）挂成可渲染节点
 */
export default defineComponent({
  name: 'DataTableCell',
  props: {
    content: { type: null, required: true },
  },
  setup(props) {
    return () => props.content;
  },
});
