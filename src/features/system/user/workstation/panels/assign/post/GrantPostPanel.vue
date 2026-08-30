<script lang="ts" setup>
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { getUserProfile } from '@/features/system/api/user/userBase';
import { getUserPostPage, type UserPostPageQuery, type UserPostPageRow } from '@/features/system/api/user/userPost';
import { errorMessage } from '@/services/feedback/message';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { SYS_USER_POST_PERMS } from '@/features/system/user/constants/permissions';
import useGrantPostAction from '@/features/system/user/workstation/hooks/post/useGrantPostAction';
import useUserPostAssignTableColumns from '@/features/system/user/workstation/hooks/post/useUserPostAssignTableColumns';
import type { FormInstance } from 'element-plus';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({ name: 'UserWorkstationGrantPostPanel' });

const route = useRoute();
const { t } = useI18n();
const ph = useFormPlaceholder();

const userId = computed(() => String(route.params.userId ?? ''));
const username = ref('');
const nickname = ref('');
const searchFormRef = ref<FormInstance>();

const postAssignState = usePaginationState<UserPostPageRow, UserPostPageQuery>({
  searchForm: reactive({
    postCode: undefined,
    postName: undefined,
  }),
  fetchApi: (query) => getUserPostPage(userId.value, query),
});
const { fetchTableData, resetQuery, loading, searchForm, selectedRows } = postAssignState;

const { openCreateDialog, openEditDialog, deleteBatchRows, clearAllPosts } = useGrantPostAction({
  userId: userId.value,
  fetchTableData,
  selectedRows,
});

const hasSelection = computed(() => selectedRows.value.length > 0);
const tableTitle = computed(() => `${nickname.value || username.value} (${username.value})`);

const { columns } = useUserPostAssignTableColumns();

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
    nickname.value = profile.nickname;
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
    <el-alert :title="t('users.postAssign.panelTip')" closable show-icon type="info" />
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-6" inline>
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

      <el-form-item>
        <el-button v-auth="SYS_USER_POST_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_USER_POST_PERMS.QUERY" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="postAssignState" :title="tableTitle">
      <template #buttons>
        <el-button v-auth="SYS_USER_POST_PERMS.CREATE" type="primary" @click="openCreateDialog">
          {{ t('buttons.actionAdd') }}
        </el-button>
        <el-button
          v-auth="SYS_USER_POST_PERMS.DELETE"
          :disabled="!hasSelection"
          type="danger"
          @click="deleteBatchRows()"
        >
          {{ t('buttons.actionBatchDelete') }}
        </el-button>
        <el-button v-auth="SYS_USER_POST_PERMS.DELETE" type="danger" @click="clearAllPosts">
          {{ t('buttons.assignClearAll') }}
        </el-button>
      </template>

      <template #actions="{ row }">
        <div class="flex flex-wrap items-center gap-x-1">
          <el-button v-auth="SYS_USER_POST_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
            {{ t('buttons.actionEdit') }}
          </el-button>
          <el-button v-auth="SYS_USER_POST_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
            {{ t('buttons.actionDelete') }}
          </el-button>
        </div>
      </template>
    </ListTable>
  </div>
</template>
