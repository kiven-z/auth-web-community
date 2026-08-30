<script lang="ts" setup>
import { getAuthorizationInvalidationEventPage } from '@/features/ops/api/authorization-invalidation-event';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { SYS_AUTH_INVALIDATION_EVENT_PERMS } from '@/features/ops/authorization-invalidation-event/constants/permissions';
import useAuthorizationInvalidationOptions from '@/features/ops/_shared/hooks/options/useAuthorizationInvalidationOptions';
import useAuthorizationInvalidationEventTableAction from '@/features/ops/authorization-invalidation-event/hooks/actions/useAuthorizationInvalidationEventTableAction';
import useAuthorizationInvalidationEventTableColumns from '@/features/ops/authorization-invalidation-event/hooks/columns/useAuthorizationInvalidationEventTableColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

defineOptions({
  name: 'OpsAuthorizationInvalidationEvent',
});

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const ph = useFormPlaceholder();
const { changeKindOptions, processingFilterOptions } = useAuthorizationInvalidationOptions();
const { columns } = useAuthorizationInvalidationEventTableColumns();
const searchFormRef = ref<FormInstance>();

const eventState = usePaginationState({
  fetchApi: getAuthorizationInvalidationEventPage,
  searchForm: reactive({
    eventId: undefined,
    changeKind: undefined,
    processing: undefined,
    processedAtStart: undefined,
    processedAtEnd: undefined,
  }),
});

const { loading, searchForm, fetchTableData } = eventState;

const { openDetailDialog, releaseClaimRow } = useAuthorizationInvalidationEventTableAction({
  fetchTableData,
});

/**
 * 将地址栏筛选同步到搜索表单
 */
function applyRouteQueryFilters() {
  const value = route.query.processing;
  if (value === 'true' || value === 'false') {
    searchForm.processing = value === 'true';
  } else {
    searchForm.processing = undefined;
  }
}

/**
 * 重置筛选并清掉地址栏参数
 * @param formRef 搜索表单实例
 */
async function handleReset(formRef?: FormInstance) {
  formRef?.resetFields();
  if (route.query.processing !== undefined) {
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

      <el-form-item :label="t('authorizationInvalidation.processing')" prop="processing">
        <el-select
          v-model="searchForm.processing"
          :placeholder="ph.selectFilter('authorizationInvalidation.processing')"
          class="w-45!"
          clearable
        >
          <el-option
            v-for="option in processingFilterOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="t('authorizationInvalidation.processedAt')" prop="processedAtStart">
        <el-date-picker
          v-model="searchForm.processedAtStart"
          :placeholder="ph.rangeStart()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-40!"
          type="datetime"
        />
      </el-form-item>
      <el-form-item prop="processedAtEnd">
        <el-date-picker
          v-model="searchForm.processedAtEnd"
          :placeholder="ph.rangeEnd()"
          :value-format="INSTANT_PICKER_VALUE_FORMAT"
          class="w-40!"
          type="datetime"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          v-auth="SYS_AUTH_INVALIDATION_EVENT_PERMS.QUERY"
          :loading="loading"
          type="primary"
          @click="fetchTableData"
        >
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="SYS_AUTH_INVALIDATION_EVENT_PERMS.QUERY" @click="handleReset(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="eventState" :title="t('authorizationInvalidation.tableTitle')">
      <template #actions="{ row }">
        <el-button v-auth="SYS_AUTH_INVALIDATION_EVENT_PERMS.DETAIL" link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button
          v-if="row.processing"
          v-auth="SYS_AUTH_INVALIDATION_EVENT_PERMS.RELEASE_CLAIM"
          link
          type="warning"
          @click="releaseClaimRow(row)"
        >
          {{ t('authorizationInvalidation.releaseClaimAction') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
