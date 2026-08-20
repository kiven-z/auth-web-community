<script lang="ts" setup>
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import {
  getPersonalFileRecycleDetail,
  purgePersonalFileRecycle,
  queryPersonalFileRecyclePage,
  restorePersonalFileRecycle,
} from '@/features/file/api/file-me-recycle';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { useFileRecycleTableActionCore, useFileRecycleTableColumns } from '@/components/domain/file/FileRecycleTable';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PersonalRecyclePanel',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useFileRecycleTableColumns();
const searchFormRef = ref<FormInstance>();

const personalFileRecycleState = usePaginationState({
  fetchApi: (params) => {
    const { createdAtRange, ...rest } = params;
    return queryPersonalFileRecyclePage({
      ...rest,
      startTime: createdAtRange?.[0],
      endTime: createdAtRange?.[1],
    });
  },
  searchForm: reactive({
    bizType: undefined,
    bizId: undefined,
    contentType: undefined,
    originalName: undefined,
    createdAtRange: undefined,
  }),
});

const { loading, selectedRows, searchForm, fetchTableData, resetQuery } = personalFileRecycleState;
const { openDetailDialog, deleteBatchRows, restoreBatchRows } = useFileRecycleTableActionCore({
  fetchTableData,
  selectedRows,
  restoreApi: restorePersonalFileRecycle,
  purgeApi: purgePersonalFileRecycle,
  detailApi: getPersonalFileRecycleDetail,
});

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(5);

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
      <el-form-item :label="t('fileRecycle.fields.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.bizType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecycle.fields.bizId')" prop="bizId">
        <el-input
          v-model="searchForm.bizId"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.bizId')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecycle.fields.originalName')" prop="originalName">
        <el-input
          v-model="searchForm.originalName"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.originalName')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecycle.fields.contentType')" prop="contentType">
        <el-input
          v-model="searchForm.contentType"
          :placeholder="placeholderBuilder.input('fileRecycle.fields.contentType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('fileRecycle.fields.createdAtRange')" prop="createdAtRange">
          <el-date-picker
            v-model="searchForm.createdAtRange"
            :end-placeholder="placeholderBuilder.rangeEnd()"
            :start-placeholder="placeholderBuilder.rangeStart()"
            :value-format="INSTANT_PICKER_VALUE_FORMAT"
            class="w-90!"
            type="datetimerange"
          />
        </el-form-item>
      </template>

      <el-form-item>
        <el-button :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
        <el-button v-if="showAdvancedSearchToggle" @click="toggleAdvancedSearch">
          {{ searchExpanded ? t('buttons.actionCollapseSearch') : t('buttons.actionAdvancedSearch') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="columns" :state="personalFileRecycleState" :title="t('fileRecycle.page.tableTitle')">
      <template #buttons>
        <el-button :disabled="selectedRows.length <= 0" type="primary" @click="restoreBatchRows()">
          {{ t('buttons.actionBatchRestore') }}
        </el-button>
        <el-button :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows()">
          {{ t('buttons.actionBatchDelete') }}
        </el-button>
      </template>

      <template #actions="{ row }">
        <el-button link type="primary" @click="restoreBatchRows([row.id])">
          {{ t('buttons.actionRestore') }}
        </el-button>
        <el-button link type="primary" @click="openDetailDialog(row)">
          {{ t('buttons.actionView') }}
        </el-button>
        <el-button link type="danger" @click="deleteBatchRows([row.id])">
          {{ t('buttons.actionDelete') }}
        </el-button>
      </template>
    </ListTable>
  </div>
</template>
