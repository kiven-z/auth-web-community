<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/AuditColumns';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysPermissionDetail } from '@/features/system/api/permission/permission';
import DetailRelationCountBar from '@/features/system/_shared/components/DetailRelationCountBar.vue';
import Description from '@/components/ui/Description';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/BooleanStatusTag';
import useOpenPermissionAuthorizationSurface from '@/features/system/permission/hooks/authorization/useOpenPermissionAuthorizationSurface';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

const props = defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();
const { openPermissionAuthorizationSurface } = useOpenPermissionAuthorizationSurface();

const descriptionColumns = computed(() => [
  { label: t('permissions.field.permissionCode'), prop: 'permissionCode', labelWidth: 120, copy: true },
  { label: t('permissions.field.permissionName'), prop: 'permissionName', labelWidth: 120, copy: true },
  {
    label: t('permissions.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (value ? renderActiveStatusTag() : renderInactiveStatusTag()),
  },
  { label: t('permissions.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('permissions.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

const relationCountItems = computed(() => [
  { label: t('permissions.bound.roles.title'), count: props.data?.boundRoleCount },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <DetailRelationCountBar
      :items="relationCountItems"
      @view-authorization="
        openPermissionAuthorizationSurface({
          permissionId: data.id,
          permissionCode: data.permissionCode,
          permissionName: data.permissionName,
        })
      "
    />
  </div>
</template>
