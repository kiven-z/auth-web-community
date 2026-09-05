<script lang="ts" setup>
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import Search from '~icons/ri/search-eye-line';
import { computed, CSSProperties, ref, watch } from 'vue';
import IconifyIconOffline from '../iconify-icon-offline';
import IconifyIconOnline from '../iconify-icon-online';
import { IconJson } from './catalog';
import { type IconCollectionKey, type IconCollectionMap, pageForIcon, parseIconModelValue } from './model';

type ParameterCSSProperties = (item?: string) => CSSProperties | undefined;

defineOptions({
  name: 'IconSelect',
});

const inputValue = defineModel({ type: String });

const icon = ref();
const currentActiveType = ref<IconCollectionKey>('ri:');
const copyIconList = cloneDeep(IconJson) as IconCollectionMap;
const pageSize = ref(35);
const currentPage = ref(1);
const filterValue = ref('');

/** 仅允许 Remix / Element Plus（Tab 键与 IconJson 一致，仍用冒号） */
const tabsList: Array<{ label: string; name: IconCollectionKey }> = [
  { label: 'Remix Icon', name: 'ri:' },
  { label: 'Element Plus', name: 'ep:' },
];

const filteredIcons = computed(() => {
  const icons = copyIconList[currentActiveType.value];
  const keyword = filterValue.value;
  return keyword ? icons.filter((name) => name.includes(keyword)) : [...icons];
});

const pageList = computed(() => {
  const page = currentPage.value;
  const size = pageSize.value;
  return filteredIcons.value.slice((page - 1) * size, page * size);
});

const totalPage = computed(() => filteredIcons.value.length);

const iconItemStyle = computed((): ParameterCSSProperties => {
  return (item) => {
    const collection = currentActiveType.value.replace(/:$/, '');
    if (inputValue.value === `${collection}/${item}`) {
      return {
        borderColor: 'var(--el-color-primary)',
        color: 'var(--el-color-primary)',
      };
    }
  };
});

/**
 * 从斜杠键名解析 Tab 与图标名（约定仅 `ri/xxx`、`ep/xxx`）
 */
function setVal() {
  const parsed = parseIconModelValue(inputValue.value ?? '');
  if (!parsed) {
    return;
  }
  currentActiveType.value = parsed.collection;
  icon.value = parsed.iconName;
}

/**
 * 打开选择器时定位到当前图标所在页
 */
function onBeforeEnter() {
  if (isEmpty(icon.value)) {
    return;
  }
  setVal();
  currentPage.value = pageForIcon(copyIconList[currentActiveType.value], icon.value, pageSize.value);
}

function onAfterLeave() {
  filterValue.value = '';
}

function handleClick({ props }) {
  currentPage.value = 1;
  currentActiveType.value = props.name;
}

/**
 * 选中后写入离线键名
 * @param item 图标名（不含集合前缀）
 */
function onChangeIcon(item: string) {
  icon.value = item;
  const collection = currentActiveType.value.replace(/:$/, '');
  inputValue.value = `${collection}/${item}`;
}

function onCurrentChange(page: number) {
  currentPage.value = page;
}

function onClear() {
  icon.value = '';
  inputValue.value = '';
}

watch(
  () => inputValue.value,
  (val) => val && setVal(),
  { immediate: true }
);
watch(
  () => filterValue.value,
  () => (currentPage.value = 1)
);
</script>

<template>
  <div class="selector">
    <el-input v-model="inputValue" disabled placeholder="选择菜单图标">
      <template #append>
        <el-popover
          :popper-options="{
            placement: 'auto',
          }"
          :width="350"
          popper-class="auth-popper"
          trigger="click"
          @before-enter="onBeforeEnter"
          @after-leave="onAfterLeave"
        >
          <template #reference>
            <div class="flex h-8 w-10 cursor-pointer items-center justify-center">
              <IconifyIconOffline v-if="!icon" :icon="Search" />
              <IconifyIconOnline v-else :icon="(inputValue || '').replace('/', ':')" />
            </div>
          </template>

          <el-input v-model="filterValue" class="px-2 pt-2" clearable placeholder="搜索图标" />

          <el-tabs v-model="currentActiveType" @tab-click="handleClick">
            <el-tab-pane v-for="(pane, index) in tabsList" :key="index" :label="pane.label" :name="pane.name">
              <el-scrollbar height="220px">
                <ul class="ml-2! flex flex-wrap px-2!">
                  <li
                    v-for="(item, key) in pageList"
                    :key="key"
                    :style="iconItemStyle(item)"
                    :title="item"
                    class="icon-item mt-1 mr-2 flex cursor-pointer items-center justify-center border border-auth-border p-2"
                    @click="onChangeIcon(item)"
                  >
                    <IconifyIconOnline :icon="`${currentActiveType}${item}`" height="20px" width="20px" />
                  </li>
                </ul>
                <el-empty v-show="pageList.length === 0" :description="`${filterValue} 图标不存在`" :image-size="60" />
              </el-scrollbar>
            </el-tab-pane>
          </el-tabs>

          <div class="flex h-9 w-full items-center overflow-auto border-t border-auth-border">
            <el-pagination
              :current-page="currentPage"
              :page-size="pageSize"
              :pager-count="5"
              :total="totalPage"
              background
              class="ml-2 flex-auto"
              layout="pager"
              size="small"
              @current-change="onCurrentChange"
            />
            <el-button bg class="mx-2! justify-end" size="small" text type="danger" @click="onClear">清空</el-button>
          </div>
        </el-popover>
      </template>
    </el-input>
  </div>
</template>

<style lang="scss" scoped>
.icon-item {
  &:hover {
    color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    transform: scaleX(1.05);
    transition: all 0.4s;
  }
}

:deep(.el-tabs__nav-next) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: -5px 0 5px -6px var(--auth-color-border);
}

:deep(.el-tabs__nav-prev) {
  font-size: 15px;
  line-height: 32px;
  box-shadow: 5px 0 5px -6px var(--auth-color-border);
}

:deep(.el-input-group__append) {
  padding: 0;
}

:deep(.el-tabs__item) {
  height: 30px;
  font-size: 12px;
  font-weight: normal;
  line-height: 30px;
}

:deep(.el-tabs__header),
:deep(.el-tabs__nav-wrap) {
  position: static;
  margin: 0;
  box-shadow: 0 2px 5px rgb(0 0 0 / 6%);
}

:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__nav-wrap) {
  padding: 0 24px;
}

:deep(.el-tabs__content) {
  margin-top: 4px;
}
</style>
