<script lang="ts" setup>
import { getUserProfile } from '@/features/system/api/user/user-base';
import { getUserDeptPage, type UserDeptPageQuery, type UserDeptPageRow } from '@/features/system/api/user/user-dept';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_USER_DEPT_PERMS } from '@/features/system/user/constants/permissions';
import useGrantDeptAction from '@/features/system/user/workstation/hooks/dept/useGrantDeptAction';
import useUserDeptAssignTableColumns from '@/features/system/user/workstation/hooks/dept/useUserDeptAssignTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({ name: 'UserWorkstationGrantDeptPanel' });

const route = useRoute();
const { t } = useI18n();
const ph = useFormPlaceholder();

const userId = computed(() => String(route.params.userId ?? ''));
const username = ref('');
const nickname = ref('');
const searchFormRef = ref<FormInstance>();

const deptAssignState = usePaginationState<UserDeptPageRow, UserDeptPageQuery>({
  searchForm: reactive({
    deptName: undefined,
    deptCode: undefined,
  }),
  fetchApi: (query) => getUserDeptPage(userId.value, query),
});
const { fetchTableData, resetQuery, loading, searchForm, selectedRows } = deptAssignState;

const { openCreateDialog, openEditDialog, deleteBatchRows, clearAllDepts } = useGrantDeptAction({
  userId: userId.value,
  fetchTableData,
  selectedRows,
});

const hasSelection = computed(() => selectedRows.value.length > 0);
const tableTitle = computed(() => `${nickname.value || username.value} (${username.value})`);

const { columns } = useUserDeptAssignTableColumns();

/**
 * 拉取用户名用于表格标题
 */
async function loadUserTitle() {
  if (!userId.value) {
    return;
  }
  try {
    const profile = await getUserProfile(userId.value);
    username.value = profile.username;
    nickname.value = profile.nickname ?? '';
  } catch (error: unknown) {
    errorMessage(error);
    username.value = '';
    nickname.value = '';
  }
}

watch(
  userId,
  () => {
    void loadUserTitle();
    void fetchTableData();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-col">
    <el-alert :title="t('users.deptAssign.panelTip')" closable show-icon type="info" />
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-6" inline>
      <el-form-item :label="t('dept.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('dept.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
        <el-input
          v-model="searchForm.deptCode"
          :placeholder="ph.input('dept.field.deptCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button v-auth="SYS_USER_DEPT_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_USER_DEPT_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="deptAssignState" :title="tableTitle">
      <template #buttons>
        <el-button v-auth="SYS_USER_DEPT_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>
        <el-button
          v-auth="SYS_USER_DEPT_PERMS.DELETE"
          :disabled="!hasSelection"
          type="danger"
          @click="deleteBatchRows()"
        >
          {{ t('buttons.actionBatchDelete') }}
        </el-button>
        <el-button v-auth="SYS_USER_DEPT_PERMS.DELETE" type="danger" @click="clearAllDepts">
          {{ t('buttons.assignClearAll') }}
        </el-button>
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap items-center gap-x-1">
          <el-button v-auth="SYS_USER_DEPT_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
            {{ t('buttons.actionEdit') }}
          </el-button>
          <el-button v-auth="SYS_USER_DEPT_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
      </template>
    </ListTable>
  </div>
</template>
