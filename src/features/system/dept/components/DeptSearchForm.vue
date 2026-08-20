<script lang="ts" setup>
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import useDeptPageState from '@/features/system/dept/hooks/useDeptPageState';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptSearchForm',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const searchFormRef = ref<FormInstance>();

const { loading, searchForm, refresh, resetCurrentViewQuery } = useDeptPageState();
</script>

<template>
  <el-form
    ref="searchFormRef"
    v-enter-submit="refresh"
    :model="searchForm"
    class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
    inline
  >
    <el-form-item :label="t('dept.field.deptName')" prop="deptName">
      <el-input v-model="searchForm.deptName" :placeholder="ph.input('dept.field.deptName')" class="w-45!" clearable />
    </el-form-item>

    <el-form-item :label="t('dept.field.deptCode')" prop="deptCode">
      <el-input v-model="searchForm.deptCode" :placeholder="ph.input('dept.field.deptCode')" class="w-45!" clearable />
    </el-form-item>

    <el-form-item :label="t('dept.field.status')" prop="status">
      <el-select
        v-model="searchForm.status"
        :placeholder="ph.selectFilter('dept.field.status')"
        class="w-45!"
        clearable
      >
        <el-option v-for="opt in booleanStatusOptions" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button :loading="loading" type="primary" @click="refresh">
        {{ t('buttons.actionSearch') }}
      </el-button>
      <el-button @click="resetCurrentViewQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
    </el-form-item>
  </el-form>
</template>
