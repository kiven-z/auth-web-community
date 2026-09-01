<script lang="ts" setup>
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/use-common-boolean-status-options';
import { useFormPlaceholder } from '@/shared/composables/i18n/use-form-placeholder';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/use-menu-type-options';
import useMenuPageState from '@/features/system/menu/hooks/use-menu-page-state';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuSearchForm',
});

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const menuTypeOptions = useMenuTypeOptions();
const searchFormRef = ref<FormInstance>();

const { loading, searchForm, refresh, resetCurrentViewQuery } = useMenuPageState();
</script>

<template>
  <el-form
    ref="searchFormRef"
    v-enter-submit="refresh"
    :model="searchForm"
    class="bg-auth-container w-[99/100] overflow-auto pl-8 pt-3"
    inline
  >
    <el-form-item :label="t('sysMenu.routeName')" prop="name">
      <el-input v-model="searchForm.name" :placeholder="ph.input('sysMenu.routeName')" class="w-45!" clearable />
    </el-form-item>

    <el-form-item :label="t('sysMenu.menuTitle')" prop="title">
      <el-input v-model="searchForm.title" :placeholder="ph.input('sysMenu.menuTitle')" class="w-45!" clearable />
    </el-form-item>

    <el-form-item :label="t('sysMenu.menuType')" prop="menuType">
      <el-select
        v-model="searchForm.menuType"
        :placeholder="ph.selectFilter('sysMenu.menuType')"
        class="w-40!"
        clearable
      >
        <el-option v-for="opt in menuTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

    <el-form-item :label="t('sysMenu.status')" prop="status">
      <el-select v-model="searchForm.status" :placeholder="ph.selectFilter('sysMenu.status')" class="w-35!" clearable>
        <el-option v-for="opt in booleanStatusOptions" :key="String(opt.value)" :label="opt.label" :value="opt.value" />
      </el-select>
    </el-form-item>

    <el-form-item :label="t('sysMenu.component')" prop="component">
      <el-input v-model="searchForm.component" :placeholder="ph.input('sysMenu.component')" class="w-45!" clearable />
    </el-form-item>

    <el-form-item>
      <el-button :loading="loading" type="primary" @click="refresh">
        {{ t('buttons.actionSearch') }}
      </el-button>
      <el-button @click="resetCurrentViewQuery(searchFormRef)">{{ t('buttons.actionReset') }}</el-button>
    </el-form-item>
  </el-form>
</template>
