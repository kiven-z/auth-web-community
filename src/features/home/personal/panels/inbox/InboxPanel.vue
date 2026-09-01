<script lang="ts" setup>
import { useInAppCategorySubOptions } from '@/components/domain/message/in-app-category-sub-options';
import { DEFAULT_PAGE_SIZES, DEFAULT_PAGINATION_LAYOUT } from '@/components/table/data-table';
import { usePaginationState } from '@/components/table/list-table';
import InboxMessageList from '@/features/home/personal/panels/inbox/components/InboxMessageList.vue';
import useInboxTableAction from '@/features/home/personal/panels/inbox/hooks/use-inbox-table-action';
import {
  getInAppInboxPage,
  type InAppInboxPageQuery,
  type InAppInboxPageRow,
} from '@/features/message/api/in-app-inbox';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { useInAppInboxStore } from '@/store/modules/message/in-app-inbox';
import type { FormInstance } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed, onMounted, reactive, ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'PersonalInboxPanel',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const route = useRoute();
const router = useRouter();
const inboxStore = useInAppInboxStore();
const { majors, loadingMajors } = storeToRefs(inboxStore);

const { subOptions, loadingSubs, loadSubs } = useInAppCategorySubOptions(true);

const searchFormRef = ref<FormInstance>();

const {
  loading,
  tableData,
  selectedRows,
  searchForm,
  pagination,
  fetchTableData,
  resetQuery,
  handlePageCurrentChange,
  handlePageSizeChange,
} = usePaginationState<InAppInboxPageRow, InAppInboxPageQuery>({
  fetchApi: getInAppInboxPage,
  searchForm: reactive({
    majorCategoryId: undefined,
    categoryId: undefined,
    isRead: undefined,
    title: undefined,
  }),
});

const { deleteBatchRows, markReadBatchRows, markAllRead, deleteAll } = useInboxTableAction({
  fetchTableData,
  selectedRows,
  majorCategoryId: toRef(searchForm, 'majorCategoryId'),
});

const selectedCountOnPage = computed(
  () => tableData.value.filter((row) => selectedRows.value.includes(row.id!)).length
);
const isAllCurrentPageSelected = computed(
  () => tableData.value.length > 0 && selectedCountOnPage.value === tableData.value.length
);
const isCurrentPageIndeterminate = computed(
  () => selectedCountOnPage.value > 0 && selectedCountOnPage.value < tableData.value.length
);

/**
 * 刷新列表与大类角标（保持当前页，不重置分页）
 */
function refreshListAndMajors() {
  fetchTableData();
  inboxStore.refreshUnreadCount();
}

/**
 * 将当前大类写入路由 query，便于详情返回后还原 Tab
 * @param majorCategoryId 大类 ID
 */
function syncMajorCategoryQuery(majorCategoryId: string) {
  if (route.query.majorCategoryId === majorCategoryId) {
    return;
  }
  router.replace({ query: { ...route.query, majorCategoryId } });
}

/**
 * 重置筛选后刷新列表与大类角标
 * @param formRef 搜索表单实例
 */
function handleResetQuery(formRef?: FormInstance) {
  resetQuery(formRef);
  inboxStore.refreshUnreadCount();
}

/**
 * 切换大类 Tab
 * @param majorCategoryId 大类 ID（el-tabs name）
 */
function handleMajorTabChange(majorCategoryId: string) {
  searchForm.majorCategoryId = majorCategoryId;
  searchForm.categoryId = undefined;
  selectedRows.value = [];
  subOptions.value = [];
  syncMajorCategoryQuery(majorCategoryId);
  refreshListAndMajors();
}

onMounted(async () => {
  await inboxStore.refreshUnreadCount();

  const queryMajorId = route.query.majorCategoryId;
  const majorCategoryId =
    typeof queryMajorId === 'string' && queryMajorId ? queryMajorId : majors.value[0]?.majorCategoryId;
  if (!majorCategoryId) {
    return;
  }

  searchForm.majorCategoryId = majorCategoryId;
  syncMajorCategoryQuery(majorCategoryId);
  await fetchTableData();
});
</script>

<template>
  <div class="inbox-page">
    <div class="inbox-page__header">
      <!-- 大类 Tab：数据来自未读接口 majors -->
      <el-tabs
        v-loading="loadingMajors"
        :model-value="searchForm.majorCategoryId"
        class="inbox-page__tabs"
        @tab-change="handleMajorTabChange"
      >
        <el-tab-pane v-for="major in majors" :key="major.majorCategoryId" :name="major.majorCategoryId">
          <template #label>
            <el-badge :hidden="major.unreadCount <= 0" :value="major.unreadCount">
              <span>{{ major.majorCategoryName }}</span>
            </el-badge>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <div class="inbox-page__body">
      <el-empty v-if="!loadingMajors && majors.length === 0" :description="t('inAppInbox.emptyMajors')" />

      <template v-else>
        <div class="inbox-page__filter">
          <el-form ref="searchFormRef" v-enter-submit="refreshListAndMajors" :model="searchForm" inline>
            <el-form-item :label="t('inAppInbox.field.readStatus')" prop="isRead">
              <el-select
                v-model="searchForm.isRead"
                :placeholder="ph.selectFilter('inAppInbox.field.readStatus')"
                class="inbox-page__field"
                clearable
              >
                <el-option :label="t('inAppInbox.unread')" :value="false" />
                <el-option :label="t('inAppInbox.read')" :value="true" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('inAppInbox.field.categoryId')" prop="categoryId">
              <el-select
                v-model="searchForm.categoryId"
                :disabled="!searchForm.majorCategoryId"
                :loading="loadingSubs"
                :placeholder="ph.selectFilter('inAppInbox.field.categoryId')"
                class="inbox-page__field"
                clearable
                filterable
                @focus="loadSubs(searchForm.majorCategoryId!)"
              >
                <el-option v-for="item in subOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('inAppInbox.field.title')" prop="title">
              <el-input
                v-model="searchForm.title"
                :placeholder="ph.input('inAppInbox.field.title')"
                class="inbox-page__field"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button :loading="loading" type="primary" @click="refreshListAndMajors">
                {{ t('buttons.actionSearch') }}
              </el-button>
              <el-button @click="handleResetQuery(searchFormRef)">
                {{ t('buttons.actionReset') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="inbox-page__toolbar">
          <el-checkbox
            :indeterminate="isCurrentPageIndeterminate"
            :model-value="isAllCurrentPageSelected"
            @change="(checked) => (selectedRows = checked ? tableData.map((row) => row.id!) : [])"
          >
            {{ t('inAppInbox.selectAll') }}
          </el-checkbox>

          <el-button :disabled="selectedRows.length <= 0" @click="deleteBatchRows()">
            {{ t('buttons.actionDelete') }}
          </el-button>
          <el-button :disabled="selectedRows.length <= 0" @click="markReadBatchRows()">
            {{ t('inAppInbox.action.markRead') }}
          </el-button>
          <el-button :disabled="!searchForm.majorCategoryId" type="primary" @click="markAllRead()">
            {{ t('inAppInbox.action.markAllRead') }}
          </el-button>
          <el-button :disabled="!searchForm.majorCategoryId" @click="deleteAll()">
            {{ t('inAppInbox.action.deleteAll') }}
          </el-button>
        </div>

        <div class="inbox-page__list-host">
          <InboxMessageList
            v-model:selected-rows="selectedRows"
            :loading="loading"
            :rows="tableData"
            @row-delete="(id) => deleteBatchRows([id])"
            @row-mark-read="(id) => markReadBatchRows([id])"
          />
        </div>

        <div class="inbox-page__pagination">
          <el-pagination
            :background="true"
            :current-page="pagination.currentPage"
            :layout="DEFAULT_PAGINATION_LAYOUT"
            :page-size="pagination.pageSize"
            :page-sizes="DEFAULT_PAGE_SIZES"
            :total="pagination.total"
            @current-change="handlePageCurrentChange"
            @size-change="handlePageSizeChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inbox-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__header {
    flex-shrink: 0;
    background: var(--el-bg-color);
  }

  &__tabs {
    padding: 0;

    :deep(.el-tabs__header) {
      margin-bottom: 0;
    }

    :deep(.el-badge) {
      padding-right: 10px;
    }
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
    padding: 16px 0 0;
    overflow: hidden;
  }

  &__filter,
  &__toolbar,
  &__pagination {
    flex-shrink: 0;
  }

  &__list-host {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  &__field {
    width: 200px;
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    padding: 0 0 8px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  &__pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
