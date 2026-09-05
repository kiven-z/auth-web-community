<script lang="ts" setup>
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { IN_APP_CATEGORY_PERMS } from '@/features/message/in-app-category/constants/permissions';
import useInAppCategoryPageState from '@/features/message/in-app-category/hooks/use-in-app-category-page-state';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'InAppCategorySearchForm',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const searchFormRef = ref<FormInstance>();

const { loading, searchForm, fetchTableData, resetQuery } = useInAppCategoryPageState();
</script>

<template>
  <el-form
    ref="searchFormRef"
    v-enter-submit="fetchTableData"
    :model="searchForm"
    class="w-[99/100] overflow-auto bg-auth-container pt-3 pl-8"
    inline
  >
    <el-form-item :label="t('inAppCategory.field.code')" prop="code">
      <el-input v-model="searchForm.code" :placeholder="ph.input('inAppCategory.field.code')" class="w-45!" clearable />
    </el-form-item>
    <el-form-item :label="t('inAppCategory.field.name')" prop="name">
      <el-input v-model="searchForm.name" :placeholder="ph.input('inAppCategory.field.name')" class="w-45!" clearable />
    </el-form-item>
    <el-form-item :label="t('inAppCategory.field.status')" prop="status">
      <el-select
        v-model="searchForm.status"
        :placeholder="ph.selectFilter('inAppCategory.field.status')"
        class="w-35!"
        clearable
      >
        <el-option v-for="opt in booleanStatusOptions" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('inAppCategory.field.rootOnly')" prop="rootOnly">
      <el-select
        v-model="searchForm.rootOnly"
        :placeholder="ph.selectFilter('inAppCategory.field.rootOnly')"
        class="w-35!"
        clearable
      >
        <el-option :label="t('inAppCategory.enum.rootOnly.major')" :value="true" />
        <el-option :label="t('inAppCategory.enum.rootOnly.minor')" :value="false" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button v-auth="IN_APP_CATEGORY_PERMS.QUERY" :loading="loading" type="primary" @click="fetchTableData">
        {{ t('buttons.actionSearch') }}
      </el-button>
      <el-button v-auth="IN_APP_CATEGORY_PERMS.QUERY" @click="resetQuery(searchFormRef)">
        {{ t('buttons.actionReset') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>
