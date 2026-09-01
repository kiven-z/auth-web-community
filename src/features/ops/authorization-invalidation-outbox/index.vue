<script lang="ts" setup>
import { getAuthorizationInvalidationOutboxPage } from '@/features/ops/api/authorization-invalidation-outbox';
import ListTable, { usePaginationState } from '@/components/table/list-table';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/use-collapsible-search-form';
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/date-time';
import { isOutboxRetryable } from '@/features/ops/authorization-invalidation-outbox/constants/outbox-status';
import { SYS_AUTH_INVALIDATION_OUTBOX_PERMS } from '@/features/ops/_shared/constants/permissions';
import useAuthorizationInvalidationOptions from '@/features/ops/_shared/hooks/options/use-authorization-invalidation-options';
import useAuthorizationInvalidationOutboxTableAction from '@/features/ops/authorization-invalidation-outbox/hooks/actions/use-authorization-invalidation-outbox-table-action';
import useAuthorizationInvalidationOutboxTableColumns from '@/features/ops/authorization-invalidation-outbox/hooks/columns/use-authorization-invalidation-outbox-table-columns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'OpsAuthorizationInvalidationOutbox',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const ph = useFormPlaceholder();
const { changeKindOptions, outboxStatusOptions } = useAuthorizationInvalidationOptions();
const { columns } = useAuthorizationInvalidationOutboxTableColumns();
const searchFormRef = ref<FormInstance>();

const outboxState = usePaginationState({
  fetchApi: getAuthorizationInvalidationOutboxPage,
  searchForm: reactive({
    eventId: undefined,
    changeKind: undefined,
    status: undefined,
    sourceModule: undefined,
    sourceBizId: undefined,
    createdAtStart: undefined,
    createdAtEnd: undefined,
    processedAtStart: undefined,
    processedAtEnd: undefined,
  }),
});

const { loading, searchForm, fetchTableData } = outboxState;

const { openDetailDialog, retryOutboxRow } = useAuthorizationInvalidationOutboxTableAction({ fetchTableData });

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(7);

/**
 * 将地址栏 status 同步到搜索表单
 */
function applyRouteQueryFilters() {
  const status = route.query.status;
  searchForm.status = typeof status === 'string' && status.length > 0 ? status : undefined;
}

/**
 * 重置筛选并清掉地址栏参数
 * @param formRef 搜索表单实例
 */
async function handleReset(formRef?: FormInstance) {
  formRef?.resetFields();
  if (route.query.status !== undefined) {
    await router.replace({ query: {} });
  }
  await fetchTableData();
}

onMounted(() => {
  applyRouteQueryFilters();
  void fetchTableData();
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
      <el-form-item :label="t('authorizationInvalidation.eventId')" prop="eventId">
        <el-input
          v-model="searchForm.eventId"
          :placeholder="ph.prefix('authorizationInvalidation.eventId')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.changeKind')" prop="changeKind">
        <el-select
          v-model="searchForm.changeKind"
          :placeholder="ph.selectFilter('authorizationInvalidation.changeKind')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in changeKindOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.outboxStatus')" prop="status">
        <el-select
          v-model="searchForm.status"
          :placeholder="ph.selectFilter('authorizationInvalidation.outboxStatus')"
          class="w-45!"
          clearable
        >
          <el-option v-for="item in outboxStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.sourceModule')" prop="sourceModule">
        <el-input
          v-model="searchForm.sourceModule"
          :placeholder="ph.input('authorizationInvalidation.sourceModule')"
          class="w-45!"
          clearable
        />
      </el-form-item>

      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('authorizationInvalidation.sourceBizId')" prop="sourceBizId">
          <el-input
            v-model="searchForm.sourceBizId"
            :placeholder="ph.prefix('authorizationInvalidation.sourceBizId')"
            class="w-45!"
            clearable
          />
        </el-form-item>

        <el-form-item v-show="searchExpanded" :label="t('table.createdAt')" prop="createdAtStart">
          <el-date-picker
            v-model="searchForm.createdAtStart"
            :placeholder="ph.rangeStart()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-40!"
            type="datetime"
          />
        </el-form-item>
        <el-form-item v-show="searchExpanded" prop="createdAtEnd">
          <el-date-picker
            v-model="searchForm.createdAtEnd"
            :placeholder="ph.rangeEnd()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-40!"
            type="datetime"
          />
        </el-form-item>

        <el-form-item
          v-show="searchExpanded"
          :label="t('authorizationInvalidation.processedAt')"
          prop="processedAtStart"
        >
          <el-date-picker
            v-model="searchForm.processedAtStart"
            :placeholder="ph.rangeStart()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-40!"
            type="datetime"
          />
        </el-form-item>
        <el-form-item v-show="searchExpanded" prop="processedAtEnd">
          <el-date-picker
            v-model="searchForm.processedAtEnd"
            :placeholder="ph.rangeEnd()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-40!"
            type="datetime"
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button
          v-auth="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY"
          :loading="loading"
          type="primary"
          @click="fetchTableData"
        >
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.QUERY" @click="handleReset(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
        <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
          {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="outboxState" :title="t('authorizationInvalidation.outboxTableTitle')">
      <template #actions="{ row }">
        <el-button
          v-auth="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.DETAIL"
          link
          type="primary"
          @click="openDetailDialog(row)"
        >
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-if="isOutboxRetryable(row.status)"
          v-auth="SYS_AUTH_INVALIDATION_OUTBOX_PERMS.RETRY"
          link
          type="warning"
          @click="retryOutboxRow(row)"
        >
          {{ t('authorizationInvalidation.retryAction') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
