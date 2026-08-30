<script lang="ts" setup>
import type { DataScopeType, SysDataScopeForm } from '@/features/system/api/models/data-scope';
import { useDataScopeTypeOptions } from '@/features/system/_shared/hooks/options/useDataScopeTypeOptions';
import type { DeptSelectTreeNode } from '@/components/domain/dept/DeptSelectTree';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({ name: 'DataScopeFormFields' });

const treeSelectProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  disabled: 'disabled',
};

const form = defineModel<SysDataScopeForm>({ required: true });

const props = defineProps<{
  /** 部门树（树选择数据） */
  deptTree: DeptSelectTreeNode[];
}>();

const { t } = useI18n();
const dataScopeTypeOptions = useDataScopeTypeOptions();

const showDeptSelector = computed(() => form.value.scopeType === 'DEPT' || form.value.scopeType === 'DEPT_AND_CHILD');

watch(
  () => form.value.scopeType,
  (scopeType: DataScopeType) => {
    if (scopeType !== 'DEPT' && scopeType !== 'DEPT_AND_CHILD') {
      form.value.scopeDeptIds = [];
    }
  }
);
</script>

<template>
  <el-form-item :label="t('dataScope.field.type')" prop="scopeType">
    <el-radio-group v-model="form.scopeType" class="data-scope-form-fields__types">
      <el-radio-button v-for="option in dataScopeTypeOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </el-radio-button>
    </el-radio-group>
  </el-form-item>

  <!-- 指定部门（DEPT / DEPT_AND_CHILD） -->
  <el-form-item v-if="showDeptSelector" :label="t('dataScope.field.deptIds')" prop="scopeDeptIds">
    <el-tree-select
      v-model="form.scopeDeptIds"
      :data="props.deptTree"
      :placeholder="t('dataScope.placeholder.deptIds')"
      :props="treeSelectProps"
      check-on-click-node
      check-strictly
      class="w-full"
      clearable
      collapse-tags
      collapse-tags-indicator
      default-expand-all
      filterable
      multiple
      show-checkbox
    />
  </el-form-item>

  <el-form-item :label="t('dataScope.field.remark')" prop="remark">
    <el-input
      v-model="form.remark"
      :placeholder="t('dataScope.field.remark')"
      :rows="3"
      maxlength="500"
      show-word-limit
      type="textarea"
    />
  </el-form-item>
</template>

<style lang="scss" scoped>
.data-scope-form-fields__types {
  display: flex;
  flex-wrap: wrap;
}
</style>
