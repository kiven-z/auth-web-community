<script lang="ts" setup>
import type { InAppMessageCategoryPageRow } from '@/features/message/api/in-app-category';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import { IN_APP_CATEGORY_PERMS } from '@/features/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/features/message/in-app-category/hooks/use-in-app-category-page-state';
import useInAppCategoryTableAction from '@/features/message/in-app-category/hooks/actions/use-in-app-category-table-action';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategoryRowActions',
});

/** 业务分类行操作 props */
interface InAppCategoryRowActionsProps {
  /** 表格行或树节点 */
  row: InAppMessageCategoryPageRow;
}

const props = defineProps<InAppCategoryRowActionsProps>();

const { t } = useI18n();
const { refresh, selectedRows } = useInAppCategoryPageState();
const { openCreateDialog, openEditDialog, openDetailDialog, batchUpdateStatus, deleteBatchRows } =
  useInAppCategoryTableAction({
    refresh,
    selectedRows,
  });

/** 仅启用中的大类可新增下级 */
const canAddChild = computed(() => props.row.parentId === TREE_ROOT_PARENT_ID && props.row.status);
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-1">
    <el-button v-auth="IN_APP_CATEGORY_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（仅大类） -->
    <el-button
      v-if="canAddChild"
      v-auth="IN_APP_CATEGORY_PERMS.CREATE"
      link
      type="primary"
      @click="openCreateDialog(row)"
    >
      {{ t('inAppCategory.action.addChild') }}
    </el-button>

    <el-button v-auth="IN_APP_CATEGORY_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <el-button v-auth="IN_APP_CATEGORY_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <AuthDropdown
      :items="[
        {
          label: t('buttons.statusActiveText'),
          permission: IN_APP_CATEGORY_PERMS.UPDATE,
          disabled: row.status === true,
          onClick: () => batchUpdateStatus([row.id], true),
        },
        {
          label: t('buttons.statusInactiveText'),
          permission: IN_APP_CATEGORY_PERMS.UPDATE,
          disabled: row.status === false,
          onClick: () => batchUpdateStatus([row.id], false),
        },
      ]"
    >
      <el-button class="ml-1!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
    </AuthDropdown>
  </div>
</template>
