import { computed, ref } from 'vue';

/** 超过该数量的查询项才显示高级搜索切换按钮 */
export const SEARCH_FORM_COLLAPSE_THRESHOLD = 4;

/**
 * 内联查询表单折叠：默认展示前若干项，其余通过「高级搜索」展开
 * @param fieldCount 查询项总数（一个 label 计一项，日期范围计一项）
 * @returns 展开状态与切换方法
 */
export function useCollapsibleSearchForm(fieldCount: number) {
  const searchExpanded = ref(false);

  const showAdvancedSearchToggle = computed(() => fieldCount > SEARCH_FORM_COLLAPSE_THRESHOLD);

  const toggleAdvancedSearch = () => {
    searchExpanded.value = !searchExpanded.value;
  };

  return {
    searchExpanded,
    showAdvancedSearchToggle,
    toggleAdvancedSearch,
  };
}
