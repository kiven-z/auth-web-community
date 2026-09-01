<script lang="ts" setup>
import { transformI18n } from '@/app/plugins/i18n';
import { nextTick, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DragIcon from '~icons/ri/draggable';
import SettingIcon from '~icons/ri/settings-3-line';

import { LIST_TABLE_ICON_CLASS } from '../constants';
import { tippyOptions } from '../utils/tippy-options';

defineOptions({ name: 'ColumnSettingPopover' });

const { initSortable, checkAllChange, checkedColumnsChange, checkColumnListChange } = defineProps<{
  isIndeterminate: boolean;
  checkColumnList: string[];
  checkedColumns: string[];
  initSortable: (root: HTMLElement | null | undefined) => void;
  destroySortable: () => void;
  isFixedColumn: (label: string) => boolean;
  checkAllChange: (value: boolean) => void;
  checkedColumnsChange: (value: string[]) => void;
  checkColumnListChange: (value: boolean, label: string) => void;
  reset: () => void;
}>();

const checkAll = defineModel<boolean>('checkAll', { required: true });

const { t } = useI18n();
const columnGroupRef = ref<{ $el: HTMLElement } | null>(null);

async function onShow() {
  await nextTick();
  initSortable(columnGroupRef.value?.$el);
}
</script>

<template>
  <el-popover
    :popper-style="{ padding: 0 }"
    placement="bottom-start"
    trigger="click"
    width="200"
    @hide="destroySortable"
    @show="onShow"
  >
    <template #reference>
      <IconifyIconOffline
        v-tippy="tippyOptions(t, 'listTable.tippyColumnSettings')"
        :class="['w-4', LIST_TABLE_ICON_CLASS]"
        :icon="SettingIcon"
      />
    </template>

    <div class="list-table__popover-head">
      <el-checkbox
        v-model="checkAll"
        :indeterminate="isIndeterminate"
        :label="t('listTable.columnShowAll')"
        @change="(value: boolean | string | number) => checkAllChange(!!value)"
      />
      <el-button link type="primary" @click="reset">
        {{ t('listTable.reset') }}
      </el-button>
    </div>

    <div class="list-table__column-body">
      <el-scrollbar max-height="36vh">
        <el-checkbox-group
          ref="columnGroupRef"
          :model-value="checkedColumns"
          @update:model-value="(value: Array<string | number>) => checkedColumnsChange(value as string[])"
        >
          <!-- text-sm/leading-normal：抵消 el-checkbox-group 的 font-size:0 / line-height:0，否则拖拽图标与裸文本不可见 -->
          <div v-for="item in checkColumnList" :key="item" class="flex items-center text-sm leading-normal">
            <span :class="['drag-btn mr-2 inline-flex', isFixedColumn(item) ? 'cursor-no-drop!' : 'cursor-grab!']">
              <IconifyIconOffline :icon="DragIcon" class="h-4 w-4" />
            </span>
            <el-checkbox
              :label="item"
              :value="item"
              @change="(value: boolean | string | number) => checkColumnListChange(!!value, item)"
            >
              <span :title="transformI18n(item)" class="inline-block w-30 truncate hover:text-auth-text">
                {{ transformI18n(item) }}
              </span>
            </el-checkbox>
          </div>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
  </el-popover>
</template>
