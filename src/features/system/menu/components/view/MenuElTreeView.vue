<script lang="ts" setup>
import ElTreePanel from '@/components/table/el-tree-panel';
import { transformI18n } from '@/app/plugins/i18n';
import MenuRowActions from '@/features/system/menu/components/actions/MenuRowActions.vue';
import { SYS_MENU_PERMS } from '@/features/system/menu/constants/permissions';
import useMenuTableAction from '@/features/system/menu/hooks/actions/use-menu-table-action';
import useMenuPageState from '@/features/system/menu/hooks/use-menu-page-state';
import { useMenuTreeDrag } from '@/features/system/menu/hooks/use-menu-tree-drag';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/use-menu-type-options';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuElTreeView',
});

const treeProps = {
  label: 'title',
  children: 'children',
} as const;

const { t } = useI18n();
const menuTypeOptions = useMenuTypeOptions();

const { loading, selectedRows, treeData, viewMode, fetchTableData, loadTreeListInto, refresh } = useMenuPageState();

const { openCreateDialog } = useMenuTableAction({
  fetchTableData,
  refresh,
  viewMode,
  selectedRows,
});

const { allowDrag, allowDrop, handleNodeDrop } = useMenuTreeDrag({
  treeData,
  onMoved: () => loadTreeListInto('tree'),
});

onMounted(() => {
  loadTreeListInto('tree');
});
</script>

<template>
  <ElTreePanel
    :allow-drag="allowDrag"
    :allow-drop="allowDrop"
    :collapse-all-label="t('sysMenu.collapseAll')"
    :draggable="true"
    :expand-all-label="t('sysMenu.expandAll')"
    :loading="loading"
    :show-actions-on-hover="true"
    :title="t('sysMenu.tableTitle')"
    :tree-data="treeData"
    :tree-props="treeProps"
    @refresh="loadTreeListInto('tree')"
    @node-drop="handleNodeDrop"
  >
    <template #toolbar>
      <el-button v-auth="SYS_MENU_PERMS.CREATE" type="primary" @click="openCreateDialog()">
        {{ t('buttons.actionAdd') }}
      </el-button>
    </template>

    <template #meta="{ data }">
      <span class="font-medium">{{ transformI18n(data.title) }}</span>
      <el-text type="info">({{ data.name }})</el-text>
      <el-tag
        v-for="option in menuTypeOptions.filter((item) => item.value === data.menuType)"
        :key="option.value"
        :type="option.tagType"
        effect="plain"
        size="small"
      >
        {{ option.label }}
      </el-tag>
      <el-tag :type="data.status ? 'success' : 'danger'" effect="plain" size="small">
        {{ data.status ? t('buttons.statusActiveText') : t('buttons.statusInactiveText') }}
      </el-tag>
    </template>

    <template #actions="{ data }">
      <MenuRowActions :row="data" show-add-child />
    </template>
  </ElTreePanel>
</template>
