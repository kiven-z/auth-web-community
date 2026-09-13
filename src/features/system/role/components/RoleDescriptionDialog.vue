<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import Description from '@/components/ui/description';
import type { SysRoleDetail } from '@/features/system/api/role/role';
import useOpenRoleAuthorizationSurface from '@/features/system/role/hooks/authorization/use-open-role-authorization-surface';
import type { DetailDialog } from '@/shared/types/dialog';
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
          openRoleAuthorizationSurface({
            roleId: data.id,
            roleCode: data.roleCode,
            roleName: data.roleName,
          })
        "
      >
        {{ t('authorization.view') }}
      </el-button>
    </div>
  </div>
</template>
