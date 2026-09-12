<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysPostDetail } from '@/features/system/api/post/post';
import DetailRelationCountBar from '@/features/system/_shared/components/DetailRelationCountBar.vue';
import Description from '@/components/ui/description';
import useDeptColumns from '@/features/system/post/hooks/columns/use-dept-columns';
import { renderPostStatusTag } from '@/components/domain/post/post-status-tag';
import useOpenPostAuthorizationSurface from '@/features/system/post/hooks/authorization/use-open-post-authorization-surface';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'PostDetailDialog',
});

type PostDetailDialogProps = DetailDialog<SysPostDetail>;

const props = defineProps<PostDetailDialogProps>();
const { t } = useI18n();
const { openPostAuthorizationSurface } = useOpenPostAuthorizationSurface();

const { deptDescriptionColumns } = useDeptColumns();

const descriptionColumns = computed(() => [
  { label: t('post.field.postCode'), prop: 'postCode', labelWidth: 120, copy: true },
  { label: t('post.field.postName'), prop: 'postName', labelWidth: 120, copy: true },
  {
    label: t('post.field.status'),
    prop: 'status',
    labelWidth: 150,
    cellRenderer: () => {
      return renderPostStatusTag({
        status: props.data?.status === true,
        effective: props.data?.effective,
      });
    },
  },
  { label: t('post.field.orderNum'), prop: 'orderNum', labelWidth: 120 },
  { label: t('post.field.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

const relationCountItems = computed(() => [
  { label: t('post.bound.users.title'), count: props.data?.boundUserCount },
  { label: t('post.bound.roles.title'), count: props.data?.boundRoleCount },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <p class="mb-2 text-sm font-medium text-(--el-text-color-primary)">
      {{ t('post.bound.dept.title') }}
    </p>
    <Description :column="2" :columns="deptDescriptionColumns" :data="data.boundDept ?? {}" />

    <el-divider />

    <DetailRelationCountBar
      :items="relationCountItems"
      @view-authorization="
        openPostAuthorizationSurface({
          postId: data.id,
          postCode: data.postCode,
          postName: data.postName,
        })
      "
    />
  </div>
</template>
