<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysPermissionDetail } from '@/features/system/api/permission/permission';
import Description from '@/components/ui/description';
import useOpenPermissionAuthorizationSurface from '@/features/system/permission/hooks/authorization/use-open-permission-authorization-surface';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PermissionDescriptionDialog',
});

type PermissionDescriptionDialogProps = DetailDialog<SysPermissionDetail>;

defineProps<PermissionDescriptionDialogProps>();
const { t } = useI18n();
const { openPermissionAuthorizationSurface } = useOpenPermissionAuthorizationSurface();

const descriptionColumns = computed(() => [
  { label: t('permissions.field.permissionCode'), prop: 'permissionCode', labelWidth: 120, copy: true },
  { label: t('permissions.field.permissionName'), prop: 'permissionName', labelWidth: 120, copy: true },
  {
    label: t('permissions.field.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }) =>
      value ? (
        <ElTag type="success" effect="plain">
          {t('buttons.statusActiveText')}
        </ElTag>
      ) : (
        <ElTag type="danger" effect="plain">
          {t('buttons.statusInactiveText')}
        </ElTag>
      ),
  },
  { label: t('permissions.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('permissions.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
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
          openPermissionAuthorizationSurface({
            permissionId: data.id,
            permissionCode: data.permissionCode,
            permissionName: data.permissionName,
          })
        "
      >
        {{ t('authorization.view') }}
      </el-button>
    </div>
  </div>
</template>
