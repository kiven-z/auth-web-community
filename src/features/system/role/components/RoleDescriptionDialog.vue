<script lang="tsx" setup>
import type { SysRoleDetail } from '@/features/system/api/role/role';
import DetailRelationCountBar from '@/features/system/_shared/components/DetailRelationCountBar.vue';
import Description from '@/components/ui/description';
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import type { DetailDialog } from '@/shared/types/dialog';
import useOpenRoleAuthorizationSurface from '@/features/system/role/hooks/authorization/use-open-role-authorization-surface';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'RoleDescriptionDialog',
});

type RoleDescriptionDialogProps = DetailDialog<SysRoleDetail>;

const props = defineProps<RoleDescriptionDialogProps>();
const { t } = useI18n();
const { openRoleAuthorizationSurface } = useOpenRoleAuthorizationSurface();

const descriptionColumns = computed(() => [
  { label: t('roles.field.roleCode'), prop: 'roleCode', labelWidth: 120, copy: true },
  { label: t('roles.field.roleName'), prop: 'roleName', labelWidth: 120, copy: true },
  {
    label: t('roles.field.status'),
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
  { label: t('roles.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('roles.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

const relationCountItems = computed(() => [
  { label: t('roles.bound.permissionsTitle'), count: props.data?.permissionCount },
  { label: t('roles.bound.menus.title'), count: props.data?.menuCount },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <DetailRelationCountBar
      :items="relationCountItems"
      @view-authorization="
        openRoleAuthorizationSurface({
          roleId: data.id,
          roleCode: data.roleCode,
          roleName: data.roleName,
        })
      "
    />
  </div>
</template>
