<script lang="ts" setup>
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { createAssignCheckboxColumnFromModel } from '@/features/system/_shared/columns/createAssignCheckboxColumn';
import AssignPanel from '@/features/system/_shared/components/AssignPanel.vue';
import { useAssignModel } from '@/features/system/_shared/hooks/useAssignModel';
import type { AssignSeedItem } from '@/features/system/_shared/types';
import {
  getPermissionPage,
  type SysPermissionPageQuery,
  type SysPermissionPageRow,
} from '@/features/system/api/permission/permission';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'PermissionAssignPanel' });

const selectedKeys = defineModel<string[]>({ required: true });

const props = defineProps<{
  leftTitle: string;
  leftSubtitle: string;
  tableTitle: string;
  loadAssigned: () => Promise<AssignSeedItem[]>;
  sectionLabel?: string;
}>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const searchFormRef = ref<FormInstance>();

const permissionState = usePaginationState<SysPermissionPageRow, SysPermissionPageQuery>({
  searchForm: reactive({
    permissionName: undefined,
    permissionCode: undefined,
  }),
  fetchApi: (query) => getPermissionPage({ ...query, status: true }),
});

const { tableData, loading, searchForm, fetchTableData, resetQuery } = permissionState;

const assignModel = useAssignModel({
  selectedKeys,
  getRowLabel: (row) => String(row.permissionName ?? ''),
  rows: tableData,
});

const { labels, applyAssigned, handleRowClick } = assignModel;

const permissionAssignColumns = computed<TableColumnList>(() => [
  createAssignCheckboxColumnFromModel(assignModel, { label: t('table.assigned') }),
  {
    label: t('permissions.field.permissionName'),
    prop: 'permissionName',
  },
  {
    label: t('permissions.field.permissionCode'),
    prop: 'permissionCode',
  },
]);

/**
 * 拉取已分配权限并写入 v-model
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
    :section-label="sectionLabel ?? t('permissions.assign.sectionLabel')"
  >
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="mb-3 w-full shrink-0 overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('permissions.field.permissionName')" prop="permissionName">
        <el-input
          v-model="searchForm.permissionName"
          :placeholder="ph.input('permissions.field.permissionName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('permissions.field.permissionCode')" prop="permissionCode">
        <el-input
          v-model="searchForm.permissionCode"
          :placeholder="ph.input('permissions.field.permissionCode')"
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
      :columns="permissionAssignColumns"
      :state="permissionState"
      :title="tableTitle"
      adaptive="fill"
      :row-class-name="() => 'cursor-pointer'"
      @row-click="handleRowClick"
    />
  </AssignPanel>
</template>
