<script lang="ts" setup>
import { getRolePage } from '@/features/system/api/role/role';
import AssignPanel from '@/features/system/_shared/components/AssignPanel.vue';
import type { AssignSeedItem } from '@/features/system/_shared/types';
import { createAssignCheckboxColumnFromModel } from '@/features/system/_shared/columns/create-assign-checkbox-column';
import { useAssignModel } from '@/features/system/_shared/hooks/use-assign-model';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleAssignPanel' });

const selectedKeys = defineModel<string[]>({ required: true });

const props = defineProps<{
  leftTitle: string;
  leftSubtitle: string;
  loadAssigned: () => Promise<AssignSeedItem[]>;
  sectionLabel?: string;
  tableTitle?: string;
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const roleState = usePaginationState({
  fetchApi: getRolePage,
  searchForm: reactive({
    roleCode: undefined,
    roleName: undefined,
    status: true,
  }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = roleState;

const assignModel = useAssignModel({
  selectedKeys,
  getRowLabel: (row) => String(row.roleName ?? ''),
  rows: tableData,
});

const { labels, applyAssigned, handleRowClick } = assignModel;

const roleAssignDataColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumnFromModel(assignModel, { label: t('table.assigned') }),
  {
    label: t('roles.field.roleCode'),
    prop: 'roleCode',
  },
  {
    label: t('roles.field.roleName'),
    prop: 'roleName',
  },
]);

/**
 * 拉取已分配角色并写入 v-model
 */
async function refreshAssigned() {
  try {
    applyAssigned(await props.loadAssigned());
  } catch (error: unknown) {
    errorMessage(error);
    applyAssigned([]);
  }
}

onMounted(() => {
  fetchTableData();
  refreshAssigned();
});
</script>

<template>
  <AssignPanel
    v-model="selectedKeys"
    :labels="labels"
    :left-subtitle="leftSubtitle"
    :left-title="leftTitle"
    :section-label="sectionLabel ?? t('roles.assign.section')"
  >
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-auth-container w-[99/100] shrink-0 overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('roles.field.roleCode')" prop="roleCode">
        <el-input
          v-model="searchForm.roleCode"
          :placeholder="ph.input('roles.field.roleCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('roles.field.roleName')" prop="roleName">
        <el-input
          v-model="searchForm.roleName"
          :placeholder="ph.input('roles.field.roleName')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
      </el-form-item>
    </el-form>

    <ListTable
      :columns="roleAssignDataColumns"
      :state="roleState"
      :title="tableTitle ?? t('roles.title.module')"
      adaptive="fill"
      :row-class-name="() => 'cursor-pointer'"
      @row-click="handleRowClick"
    />
  </AssignPanel>
</template>
