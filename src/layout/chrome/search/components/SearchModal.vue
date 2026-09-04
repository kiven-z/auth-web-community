<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import SearchResult from './SearchResult.vue';
import SearchFooter from './SearchFooter.vue';
import SearchHistory from './SearchHistory.vue';
import { computed, ref, shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useLayoutShellRuntimeStore } from '@/store/modules/layout-shell-runtime';
import { useMenuSearch } from '../hooks/use-menu-search';
import { useMenuSearchHistory } from '../hooks/use-menu-search-history';
import {
  useMenuSearchNavigation,
  type MenuSearchScrollbarRef,
  type ScrollablePanelRef,
} from '../hooks/use-menu-search-navigation';
import type { MenuTreeNode } from '../utils/menu-search-query';
import type { MenuSearchOption } from '../types';
import SearchIcon from '~icons/ri/search-line';

interface Props {
  /** 弹窗显隐 */
  value: boolean;
}

const { device } = storeToRefs(useLayoutShellRuntimeStore());
const emit = defineEmits<{
  'update:value': [val: boolean];
}>();
const props = withDefaults(defineProps<Props>(), {});

const router = useRouter();
const { t } = useI18n();

const keyword = ref('');
const resultRef = ref<ScrollablePanelRef>();
const historyRef = ref<ScrollablePanelRef>();
const scrollbarRef = ref<MenuSearchScrollbarRef>();
const activePath = ref('');
const historyPath = ref('');
const resultOptions = shallowRef<MenuTreeNode[]>([]);
const historyOptions = shallowRef<MenuSearchOption[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);

const show = computed({
  get() {
    return props.value;
  },
  set(val: boolean) {
    emit('update:value', val);
  },
});

const { handleSearch } = useMenuSearch({ keyword, resultOptions, activePath });

const history = useMenuSearchHistory({ historyOptions, historyPath });

watch(
  () => props.value,
  (opened) => {
    if (opened) {
      history.refreshHistoryOptions();
    }
  }
);

const showSearchResult = computed(() => keyword.value.length > 0 && resultOptions.value.length > 0);

const showSearchHistory = computed(() => keyword.value.length === 0 && historyOptions.value.length > 0);

const showEmpty = computed(
  () =>
    (keyword.value.length === 0 && historyOptions.value.length === 0) ||
    (keyword.value.length > 0 && resultOptions.value.length === 0)
);

function handleClose() {
  show.value = false;
  /** 延时处理防止用户看到某些操作 */
  setTimeout(() => {
    resultOptions.value = [];
    historyPath.value = '';
    keyword.value = '';
  }, 200);
}

const { handleEnter } = useMenuSearchNavigation({
  resultOptions,
  historyOptions,
  activePath,
  historyPath,
  resultRef,
  historyRef,
  scrollbarRef,
  visible: computed(() => props.value),
  onConfirm: ({ options, index, isResultOptions }) => {
    const target = options[index];
    if (isResultOptions) {
      history.saveSearchResult(target.path, target.meta);
    } else {
      history.bumpHistoryAccess(historyPath.value);
    }
    router.push(target.path);
    handleClose();
  },
});
</script>

<template>
  <el-dialog
    v-model="show"
    :before-close="handleClose"
    :class="['auth-search-dialog', { 'auth-search-dialog--mobile': device === 'mobile' }]"
    :show-close="false"
    append-to-body
    top="5vh"
    @closed="inputRef.blur()"
    @opened="inputRef.focus()"
  >
    <el-input
      ref="inputRef"
      v-model="keyword"
      :placeholder="t('search.placeholder')"
      clearable
      size="large"
      @input="handleSearch"
    >
      <template #prefix>
        <SearchIcon class="search-modal__search-icon" />
      </template>
    </el-input>
    <div class="search-modal__body">
      <el-scrollbar ref="scrollbarRef" max-height="calc(90vh - 140px)">
        <el-empty v-if="showEmpty" :description="t('search.empty')" />
        <SearchHistory
          v-if="showSearchHistory"
          ref="historyRef"
          v-model:value="historyPath"
          :options="historyOptions"
          @collect="history.collectItem"
          @delete="history.removeItem"
          @drag="history.reorderCollect"
          @enter="handleEnter"
        />
        <SearchResult
          v-if="showSearchResult"
          ref="resultRef"
          v-model:value="activePath"
          :options="resultOptions"
          @enter="handleEnter"
        />
      </el-scrollbar>
    </div>
    <template #footer>
      <SearchFooter :total="resultOptions.length" />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.search-modal__body {
  margin-top: 12px;
}

.search-modal__search-icon {
  width: 24px;
  height: 24px;
  color: var(--el-color-primary);
}
</style>
