import UserAvatar from '@/components/domain/user/UserAvatar';
import type { BoundUserReference, UserReference } from '@/features/system/api/models/grant-table';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useUserProfileDisplay from '../hooks/useUserProfileDisplay';

/**
 * 用户档案描述列与绑定用户表格列
 * @returns 用户相关列定义
 */
function useProfileUserColumns() {
  const { t } = useI18n();
  const { renderUserAccountStatus, renderUserGender, renderDeptPrimaryTag, renderDeptNonPrimaryTag } =
    useUserProfileDisplay();

  const userColumns = computed(() => [
    { label: t('users.field.username'), prop: 'username', copy: true },
    { label: t('users.field.nickname'), prop: 'nickname', copy: true },
    { label: t('users.field.email'), prop: 'email', copy: true },
    { label: t('users.field.phone'), prop: 'phone', copy: true, span: 2 },
    {
      label: t('users.field.avatarURL'),
      prop: 'avatar',
      cellRenderer: ({ value, row }: { value: string; row: { nickname?: string | null; username?: string } }) => (
        <UserAvatar avatar={value} name={row?.nickname || row?.username} size={40} />
      ),
    },
    {
      label: t('users.field.status'),
      prop: 'status',
      cellRenderer: ({ value }: { value: number }) => renderUserAccountStatus(value),
    },
    {
      label: t('users.field.gender'),
      prop: 'gender',
      cellRenderer: ({ value }: { value: number }) => renderUserGender(value),
    },
    { label: t('users.field.birthday'), prop: 'birthday', span: 2 },
    { label: t('users.field.introduction'), prop: 'introduction', span: 2 },
  ]);

  const userBindingColumns = computed<TableColumnList>(() => [
    { label: t('users.field.username'), prop: 'username', minWidth: 120 },
    { label: t('users.field.nickname'), prop: 'nickname', minWidth: 120 },
    { label: t('post.field.employeeNo'), prop: 'employeeNo', minWidth: 100 },
    {
      label: t('users.field.status'),
      prop: 'status',
      minWidth: 90,
      render: ({ row }: { row: UserReference }) => renderUserAccountStatus(row.status),
    },
  ]);

  const userRelationBindingColumns = computed<TableColumnList>(() => [
    ...userBindingColumns.value,
    {
      label: t('relation.isPrimary'),
      prop: 'isPrimary',
      minWidth: 110,
      render: ({ row }: { row: BoundUserReference }) => {
        return row.isPrimary ? renderDeptPrimaryTag() : renderDeptNonPrimaryTag();
      },
    },
  ]);

  return {
    userColumns,
    userBindingColumns,
    userRelationBindingColumns,
  };
}

export default useProfileUserColumns;
