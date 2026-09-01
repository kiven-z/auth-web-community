<script lang="ts" setup>
import ListTable from '@/components/table/list-table';
import InAppCategoryRowActions from '@/features/message/in-app-category/components/InAppCategoryRowActions.vue';
import InAppCategorySearchForm from '@/features/message/in-app-category/components/InAppCategorySearchForm.vue';
import { IN_APP_CATEGORY_PERMS } from '@/features/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/features/message/in-app-category/hooks/use-in-app-category-page-state';
import useInAppCategoryTableAction from '@/features/message/in-app-category/hooks/actions/use-in-app-category-table-action';
import useInAppCategoryTableColumns from '@/features/message/in-app-category/hooks/columns/use-in-app-category-table-columns';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryTableView',
});

const treeProps = {
  children: 'children',
  hasChildren: 'hasChildren',
} as const;

const { t } = useI18n();
const { columns } = useInAppCategoryTableColumns();
const categoryState = useInAppCategoryPageState();
const { selectedRows, fetchTableData, refresh } = categoryState;
const { openCreateDialog, batchUpdateStatus, deleteBatchRows } = useInAppCategoryTableAction({
  refresh,
  selectedRows,
});

const noSelection = computed(() => selectedRows.value.length <= 0);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <InAppCategorySearchForm />

    <ListTable
      :columns="columns"
      :default-expand-all="true"
      :state="categoryState"
      :title="t('inAppCategory.page.title')"
      :tree-props="treeProps"
    >
      <template #buttons>
        <el-button v-auth="IN_APP_CATEGORY_PERMS.CREATE" type="primary" @click="openCreateDialog()">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchEnable'),
              permission: IN_APP_CATEGORY_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(selectedRows, true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: IN_APP_CATEGORY_PERMS.UPDATE,
              disabled: noSelection,
              onClick: () => batchUpdateStatus(selectedRows, false),
            },
          ]"
        >
          <el-button :disabled="selectedRows.length <= 0" type="warning">
            {{ t('buttons.actionBatchStatus') }}
          </el-button>
        </AuthDropdown>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchDelete'),
              permission: IN_APP_CATEGORY_PERMS.DELETE,
              disabled: noSelection,
              onClick: deleteBatchRows,
            },
          ]"
        >
          <el-button type="danger">{{ t('buttons.actionAdvanced') }}</el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <InAppCategoryRowActions :row="row" />
      </template>
    </ListTable>
  </div>
</template>
