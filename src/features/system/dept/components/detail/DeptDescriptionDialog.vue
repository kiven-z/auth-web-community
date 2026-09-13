<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import { renderDeptStatusTag } from '@/components/domain/dept/dept-status-tag';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysDeptDetail } from '@/features/system/api/dept/dept';
import Description from '@/components/ui/description';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import useOpenDeptAuthorizationSurface from '@/features/system/dept/hooks/authorization/use-open-dept-authorization-surface';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptDescriptionDialog',
});

type DeptDescriptionDialogProps = DetailDialog<SysDeptDetail> & {
  /** 父部门展示名（由调用方根据扁平列表解析） */
  parentDeptLabel?: string;
};

const props = defineProps<DeptDescriptionDialogProps>();
const { t } = useI18n();
const { openDeptAuthorizationSurface } = useOpenDeptAuthorizationSurface();

const parentLabel = computed(() => {
  if (props.parentDeptLabel) {
    return props.parentDeptLabel;
  }
  const parentId = props.data?.parentId;
  if (!parentId || parentId === TREE_ROOT_PARENT_ID) {
    return t('dept.field.parentTopLevel');
  }
  return parentId;
});

const descriptionColumns = computed(() => [
  { label: t('dept.field.deptCode'), prop: 'deptCode', labelWidth: 120, copy: true },
  { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120, copy: true },
  {
    label: t('dept.field.parentDept'),
    prop: 'parentId',
    labelWidth: 120,
    cellRenderer: () => <span>{parentLabel.value}</span>,
  },
  {
    label: t('dept.field.status'),
    prop: 'status',
    labelWidth: 150,
    cellRenderer: () => {
      return renderDeptStatusTag({
        status: props.data?.status,
        effective: props.data?.effective,
      });
    },
  },
  { label: t('dept.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('dept.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <div class="mt-4 flex items-center justify-between">
      <span class="text-sm font-black">{{ t('authorization.relationTitle') }}</span>
      <el-button
        link
        type="primary"
        @click="
          openDeptAuthorizationSurface({
            deptId: data.id,
            deptCode: data.deptCode,
            deptName: data.deptName,
          })
        "
      >
        {{ t('authorization.view') }}
      </el-button>
    </div>
  </div>
</template>
