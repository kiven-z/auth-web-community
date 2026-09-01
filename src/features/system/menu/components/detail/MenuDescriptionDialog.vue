<script lang="tsx" setup>
import { createAuditDetailColumns } from '@/components/table/audit-columns';
import type { DetailDialog } from '@/shared/types/dialog';
import type { SysMenuDetailVO } from '@/features/system/api/menu/menu';
import { useRenderIcon } from '@/components/ui/icon';
import DetailRelationCountBar from '@/features/system/_shared/components/DetailRelationCountBar.vue';
import Description from '@/components/ui/description';
import { renderActiveStatusTag, renderInactiveStatusTag } from '@/components/table/boolean-status-tag';
import { transformI18n } from '@/app/plugins/i18n';
import { TREE_ROOT_PARENT_ID } from '@/shared/utils/tree';
import useOpenMenuAuthorizationSurface from '@/features/system/menu/hooks/authorization/use-open-menu-authorization-surface';
import { useMenuTypeOptions } from '@/features/system/_shared/hooks/options/use-menu-type-options';
import { ElTag } from 'element-plus';
import { computed, h } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MenuDescriptionDialog',
});

type MenuDescriptionDialogProps = DetailDialog<SysMenuDetailVO> & {
  /** 父菜单展示名（由调用方根据扁平列表解析） */
  parentMenuLabel?: string;
};

const props = defineProps<MenuDescriptionDialogProps>();
const { t } = useI18n();
const menuTypeOptions = useMenuTypeOptions();
const { openMenuAuthorizationSurface } = useOpenMenuAuthorizationSurface();

const parentLabel = computed(() => {
  if (props.parentMenuLabel) {
    return props.parentMenuLabel;
  }
  const parentId = props.data?.parentId;
  if (!parentId || parentId === TREE_ROOT_PARENT_ID) {
    return t('sysMenu.parentTopLevel');
  }
  return parentId;
});

/**
 * 布尔开关展示为是/否标签
 */
const renderYesNoTag = (value: boolean, yesKey: string, noKey: string) => (
  <ElTag type={value ? 'success' : 'info'} effect="plain">
    {t(value ? yesKey : noKey)}
  </ElTag>
);

const descriptionColumns = computed(() => [
  {
    label: t('sysMenu.menuTitle'),
    prop: 'title',
    labelWidth: 120,
    cellRenderer: () => <span>{transformI18n(props.data?.title ?? '')}</span>,
  },
  {
    label: t('sysMenu.routeName'),
    prop: 'name',
    labelWidth: 120,
    copy: true,
    cellRenderer: () => <span>{transformI18n(props.data?.name ?? '')}</span>,
  },
  { label: t('sysMenu.path'), prop: 'path', labelWidth: 120, copy: true },
  {
    label: t('sysMenu.menuType'),
    prop: 'menuType',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: number }) => {
      const option = menuTypeOptions.value.find((item) => item.value === value);
      if (!option) {
        return <span>{value}</span>;
      }
      return (
        <ElTag type={option.tagType} effect="plain">
          {option.label}
        </ElTag>
      );
    },
  },
  {
    label: t('menus.parentId'),
    prop: 'parentId',
    labelWidth: 120,
    cellRenderer: () => <span>{parentLabel.value}</span>,
  },
  {
    label: t('sysMenu.status'),
    prop: 'status',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => (value ? renderActiveStatusTag() : renderInactiveStatusTag()),
  },
  { label: t('sysMenu.menuRank'), prop: 'menuRank', labelWidth: 120 },
  { label: t('menus.component'), prop: 'component', labelWidth: 120, copy: true },
  { label: t('menus.redirect'), prop: 'redirect', labelWidth: 120, copy: true },
  { label: t('menus.activePath'), prop: 'activePath', labelWidth: 120, copy: true },
  {
    label: t('menus.icon'),
    prop: 'icon',
    labelWidth: 120,
    cellRenderer: () => <span class="flex text-xl">{props.data?.icon ? h(useRenderIcon(props.data.icon)) : '-'}</span>,
  },
  { label: t('menus.rightExtraIcon'), prop: 'extraIcon', labelWidth: 120, copy: true },
  {
    label: t('sysMenu.showLink'),
    prop: 'showLink',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderYesNoTag(value, 'sysMenu.showLinkYes', 'sysMenu.showLinkNo'),
  },
  {
    label: t('menus.publicAccess'),
    prop: 'publicAccess',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) =>
      renderYesNoTag(value, 'sysMenu.publicAccessYes', 'sysMenu.publicAccessNo'),
  },
  {
    label: t('menus.showParent'),
    prop: 'showParent',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderYesNoTag(value, 'status.show', 'status.hide'),
  },
  {
    label: t('sysMenu.keepAlive'),
    prop: 'keepAlive',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) =>
      renderYesNoTag(value, 'sysMenu.keepAliveYes', 'sysMenu.keepAliveNo'),
  },
  {
    label: t('menus.hiddenTag'),
    prop: 'hiddenTag',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderYesNoTag(value, 'buttons.forbidText', 'buttons.permitText'),
  },
  {
    label: t('menus.fixedTag'),
    prop: 'fixedTag',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderYesNoTag(value, 'buttons.fixedText', 'buttons.unFixedText'),
  },
  { label: t('menus.frameSrc'), prop: 'frameSrc', labelWidth: 120, copy: true, span: 2 },
  {
    label: t('menus.frameLoading'),
    prop: 'frameLoading',
    labelWidth: 120,
    cellRenderer: ({ value }: { value: boolean }) => renderYesNoTag(value, 'status.show', 'status.hide'),
  },
  { label: t('menus.dynamicLevel'), prop: 'dynamicLevel', labelWidth: 120 },
  { label: t('menus.transitionName'), prop: 'transitionName', labelWidth: 120 },
  { label: t('menus.enterTransition'), prop: 'enterTransition', labelWidth: 120 },
  { label: t('menus.leaveTransition'), prop: 'leaveTransition', labelWidth: 120 },
  { label: t('menus.remark'), prop: 'remark', labelWidth: 120, span: 2 },
  ...createAuditDetailColumns(),
]);

const relationCountItems = computed(() => [
  { label: t('sysMenu.bound.roles.title'), count: props.data?.boundRoleCount },
]);
</script>

<template>
  <div>
    <Description :column="2" :columns="descriptionColumns" :data="data ?? {}" />

    <el-divider />

    <DetailRelationCountBar
      :items="relationCountItems"
      @view-authorization="
        openMenuAuthorizationSurface({
          menuId: data.id,
          name: data.name,
          title: transformI18n(data.title ?? ''),
        })
      "
    />
  </div>
</template>
