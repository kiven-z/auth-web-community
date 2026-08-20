<script lang="ts" setup>
import { getPostPage } from '@/features/system/api/post/post';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_POST_PERMS } from '@/features/system/post/constants/permissions';
import usePostAdvanceAction from '@/features/system/post/hooks/actions/usePostAdvanceAction';
import usePostMoreAction from '@/features/system/post/hooks/actions/usePostMoreAction';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import usePostTableAction from '@/features/system/post/hooks/actions/usePostTableAction';
import usePostTableColumns from '@/features/system/post/hooks/columns/usePostTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'SystemPost',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();

const { columns } = usePostTableColumns();

const searchFormRef = ref<FormInstance>();

const postState = usePaginationState({
  fetchApi: getPostPage,
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
    deptName: undefined,
    status: undefined,
  }),
});

const { loading, searchForm, pagination, selectedRows, fetchTableData, resetQuery } = postState;

const { openImportDialog } = usePostAdvanceAction({
  fetchTableData,
});

const { openCreateDialog, openDetailDialog, openEditDialog, deleteRow, batchUpdateStatus } = usePostTableAction({
  fetchTableData,
});

const { openPostAuthorizationSurface } = usePostMoreAction();

const hasSelection = computed(() => selectedRows.value.length > 0);

onMounted(() => {
  fetchTableData();
});
</script>

<template>
  <div>
    <el-form
      ref="searchFormRef"
      v-enter-submit="fetchTableData"
      :model="searchForm"
      class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
      inline
    >
      <el-form-item :label="t('post.field.postCode')" prop="postCode">
        <el-input
          v-model="searchForm.postCode"
          :placeholder="ph.input('post.field.postCode')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.postName')" prop="postName">
        <el-input
          v-model="searchForm.postName"
          :placeholder="ph.input('post.field.postName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.deptName')" prop="deptName">
        <el-input
          v-model="searchForm.deptName"
          :placeholder="ph.input('post.field.deptName')"
          class="w-45!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('post.field.status')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('post.field.status')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="opt in booleanStatusOptions"
            :key="String(opt.value)"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button v-auth="SYS_POST_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_POST_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="postState" :title="t('post.page.title')">
      <template #buttons>
        <el-button v-auth="SYS_POST_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>

        <AuthDropdown
          :items="[
            {
              label: t('buttons.actionBatchEnable'),
              permission: SYS_POST_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, true),
            },
            {
              label: t('buttons.actionBatchDisable'),
              permission: SYS_POST_PERMS.UPDATE,
              disabled: !hasSelection,
              onClick: () => batchUpdateStatus(selectedRows, false),
            },
          ]"
        >
          <el-button :disabled="!hasSelection" type="warning">
            {{ t('buttons.actionBatchStatus') }}
          </el-button>
        </AuthDropdown>

        <AuthDropdown
          :items="[{ label: t('buttons.importExcel'), permission: SYS_POST_PERMS.IMPORT, onClick: openImportDialog }]"
        >
          <el-button type="danger">
            {{ t('buttons.actionAdvanced') }}
          </el-button>
        </AuthDropdown>
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap items-center gap-x-1">
          <el-button v-auth="SYS_POST_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
            {{ t('buttons.actionView') }}
          </el-button>
          <el-button v-auth="SYS_POST_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
            {{ t('buttons.actionEdit') }}
          </el-button>
          <el-button v-auth="SYS_POST_PERMS.DELETE" link type="danger" @click="deleteRow(row)">
            {{ t('buttons.actionDelete') }}
          </el-button>

          <AuthDropdown
            :items="[
              {
                label: t('post.menu.authorizationSurface'),
                permission: SYS_POST_PERMS.QUERY,
                onClick: () =>
                  openPostAuthorizationSurface({
                    postId: row.id,
                    postCode: row.postCode,
                    postName: row.postName,
                  }),
              },
            ]"
          >
            <el-button class="ml-2!" link type="primary">{{ t('buttons.actionMore') }}</el-button>
          </AuthDropdown>
        </div>
      </template>
    </ListTable>
  </div>
</template>
