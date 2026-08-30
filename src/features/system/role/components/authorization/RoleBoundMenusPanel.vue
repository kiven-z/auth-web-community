<script lang="ts" setup>
import type { RoleBoundMenuItem } from '@/features/system/api/models/role';
import type { RoleMenuPageQuery } from '@/features/system/api/role/roleAuthorization';
import ListTable, { usePaginationState } from '@/components/table/ListTable';
import { useFormPlaceholder } from '@/shared/composables/i18n/useFormPlaceholder';
import { useCommonBooleanStatusOptions } from '@/shared/composables/i18n/useCommonBooleanStatusOptions';
import type { AuthorizationSurfacePanelProps } from '@/features/system/_shared/types';
import useMenuColumns from '@/features/system/role/hooks/columns/useMenuColumns';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'RoleBoundMenusPanel' });

/** 角色已绑定菜单分页面板 */
type RoleBoundMenusPanelProps = AuthorizationSurfacePanelProps<RoleBoundMenuItem, RoleMenuPageQuery>;

const props = defineProps<RoleBoundMenusPanelProps>();

const { t } = useI18n();
const ph = useFormPlaceholder();
const booleanStatusOptions = useCommonBooleanStatusOptions();
const { menuColumns } = useMenuColumns();
const searchFormRef = ref<FormInstance>();

const menuState = usePaginationState<RoleBoundMenuItem, RoleMenuPageQuery>({
  searchForm: reactive({
    title: undefined,
    name: undefined,
    status: undefined,
  }),
  fetchApi: (query) => props.fetchPage(query),
});
const { fetchTableData, resetQuery, loading, searchForm } = menuState;

onMounted(() => {
  void fetchTableData();
});
</script>

<template>
  <div class="role-bound-menus-panel">
    <el-form ref="searchFormRef" v-enter-submit="fetchTableData" :model="searchForm" class="pt-2 pl-2" inline>
      <el-form-item :label="t('sysMenu.menuTitle')" prop="title">
        <el-input v-model="searchForm.title" :placeholder="ph.input('sysMenu.menuTitle')" class="w-45!" clearable />
      </el-form-item>
      <el-form-item :label="t('sysMenu.routeName')" prop="name">
        <el-input v-model="searchForm.name" :placeholder="ph.input('sysMenu.routeName')" class="w-45!" clearable />
      </el-form-item>
      <el-form-item :label="t('sysMenu.status')" prop="status">
        <el-select v-model="searchForm.status" :placeholder="ph.selectFilter('sysMenu.status')" class="w-45!" clearable>
          <el-option
            v-for="option in booleanStatusOptions"
            :key="String(option.value)"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="queryPerm" :loading="loading" type="primary" @click="fetchTableData">
          {{ t('buttons.actionSearch') }}
        </el-button>
        <el-button v-auth="queryPerm" @click="resetQuery(searchFormRef)">
          {{ t('buttons.actionReset') }}
        </el-button>
      </el-form-item>
    </el-form>

    <ListTable :columns="menuColumns" :state="menuState" :title="title" />
  </div>
</template>
