<script lang="ts" setup>
import {
  deletePersonalFileRecord,
  downloadPersonalFileRecord,
  getPersonalFileRecordDetail,
  queryPersonalFileRecordPage,
} from '@/features/file/api/fileMeRecord';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCollapsibleSearchForm } from '@/shared/composables/search/useCollapsibleSearchForm';
import { INSTANT_PICKER_VALUE_FORMAT } from '@/shared/utils/date/dateTime';
import { useFileRecordTableActionCore, useFileRecordTableColumns } from '@/components/domain/file/FileRecordTable';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PersonalFilesPanel',
});

const { t } = useI18n();
const placeholderBuilder = useFormPlaceholder();
const { columns } = useFileRecordTableColumns();
const searchFormRef = ref<FormInstance>();

const personalFileRecordState = usePaginationState({
  fetchApi: (params) => {
    const { createdAtRange, ...rest } = params;
    return queryPersonalFileRecordPage({
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
    createdAtRange: undefined as [string, string] | undefined,
    isPrivate: undefined,
  }),
});

const { selectedRows, loading, searchForm, fetchTableData, resetQuery } = personalFileRecordState;
const {
  deleteBatchRows,
  openDetailDialog,
  downloadRow,
  downloadBatchRows,
  batchDownloadLoading,
  currentDownloadingRowId,
} = useFileRecordTableActionCore({
  fetchTableData,
  selectedRows,
  deleteApi: deletePersonalFileRecord,
  downloadApi: downloadPersonalFileRecord,
  detailApi: getPersonalFileRecordDetail,
});

const { searchExpanded, showAdvancedSearchToggle, toggleAdvancedSearch } = useCollapsibleSearchForm(6);

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
      <el-form-item :label="t('fileRecord.fields.bizType')" prop="bizType">
        <el-input
          v-model="searchForm.bizType"
          :placeholder="placeholderBuilder.input('fileRecord.fields.bizType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecord.fields.bizId')" prop="bizId">
        <el-input
          v-model="searchForm.bizId"
          :placeholder="placeholderBuilder.input('fileRecord.fields.bizId')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecord.fields.originalName')" prop="originalName">
        <el-input
          v-model="searchForm.originalName"
          :placeholder="placeholderBuilder.input('fileRecord.fields.originalName')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <el-form-item :label="t('fileRecord.fields.contentType')" prop="contentType">
        <el-input
          v-model="searchForm.contentType"
          :placeholder="placeholderBuilder.input('fileRecord.fields.contentType')"
          class="w-42!"
          clearable
        />
      </el-form-item>
      <template v-if="showAdvancedSearchToggle">
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.isPrivate')" prop="isPrivate">
          <el-select v-model="searchForm.isPrivate" class="w-42!" clearable>
            <el-option :label="t('status.yes')" :value="true" />
            <el-option :label="t('status.no')" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item v-show="searchExpanded" :label="t('fileRecord.fields.createdAtRange')" prop="createdAtRange">
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

    <ListTable :columns="columns" :state="personalFileRecordState" :title="t('fileRecord.page.tableTitle')">
      <template #buttons>
        <el-button
          :disabled="selectedRows.length <= 0"
          :loading="batchDownloadLoading"
          type="primary"
          @click="downloadBatchRows"
        >
          {{ t('buttons.actionBatchDownload') }}
        </el-button>
        <el-button :disabled="selectedRows.length <= 0" type="danger" @click="deleteBatchRows()">
          {{ t('buttons.actionBatchDelete') }}
        </el-button>
      </template>

      <template #actions="{ row }">
        <el-button :loading="currentDownloadingRowId === row.id" link type="primary" @click="downloadRow(row)">
          {{ t('buttons.actionDownload') }}
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
