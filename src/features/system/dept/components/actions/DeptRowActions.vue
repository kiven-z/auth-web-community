<script lang="ts" setup>
import { treeRowActionsLockKey } from '@/components/table/ElTreePanel';
import { SYS_DEPT_PERMS } from '@/features/system/dept/constants/permissions';
import useDeptMoreAction from '@/features/system/dept/hooks/actions/useDeptMoreAction';
import useDeptTableAction from '@/features/system/dept/hooks/actions/useDeptTableAction';
import type { SysDeptRow } from '@/features/system/dept/hooks/useDeptPageState';
import useDeptPageState from '@/features/system/dept/hooks/useDeptPageState';
import { inject, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'DeptRowActions',
});

/** 部门行操作按钮 props */
interface DeptRowActionsProps {
  /** 部门行数据 */
  row: SysDeptRow;
  /** 树视图展示「新增下级」 */
  showAddChild?: boolean;
  /** 下拉菜单是否 Teleport 到 body */
  dropdownTeleported?: boolean;
}

const props = withDefaults(defineProps<DeptRowActionsProps>(), {
  showAddChild: false,
  dropdownTeleported: true,
});

const { t } = useI18n();
const { fetchTableData, refresh, viewMode, selectedRows } = useDeptPageState();
const { openDetailDialog, openEditDialog, openCreateDialog, deleteBatchRows } = useDeptTableAction({
  fetchTableData,
  refresh,
  viewMode,
  selectedRows,
});
const { openDeptAuthorizationSurface } = useDeptMoreAction();
const treeRowActionsLock = inject(treeRowActionsLockKey, null);

/**
 * 按下「更多」前锁定行，避免 visible-change 之前 hover 卸载
 */
function lockRowForDropdown() {
  treeRowActionsLock?.lock(props.row.id);
}

/**
 * 下拉展开期间锁定树行操作区，关闭后解除
 * @param visible 下拉是否可见
 */
function handleDropdownVisibleChange(visible: boolean) {
  if (!treeRowActionsLock) {
    return;
  }
  const key = props.row.id;
  if (visible) {
    treeRowActionsLock.lock(key);
    return;
  }
  treeRowActionsLock.unlock(key);
}

onUnmounted(() => {
  treeRowActionsLock?.unlock(props.row.id);
});
</script>

<template>
  <div class="dept-row-actions flex flex-wrap items-center gap-x-1">
    <el-button v-auth="SYS_DEPT_PERMS.QUERY" link type="primary" @click="openDetailDialog(row)">
      {{ t('buttons.actionView') }}
    </el-button>

    <!-- 新增下级（树视图）：停用部门仍可挂载子节点 -->
    <el-button v-if="showAddChild" v-auth="SYS_DEPT_PERMS.CREATE" link type="primary" @click="openCreateDialog(row)">
      {{ t('dept.action.addChild') }}
    </el-button>

    <el-button v-auth="SYS_DEPT_PERMS.UPDATE" link type="primary" @click="openEditDialog(row)">
      {{ t('buttons.actionEdit') }}
    </el-button>

    <el-button v-auth="SYS_DEPT_PERMS.DELETE" link type="danger" @click="deleteBatchRows([row.id])">
      {{ t('buttons.actionDelete') }}
    </el-button>

    <AuthDropdown
      :items="[
        {
          label: t('dept.menu.authorizationSurface'),
          permission: SYS_DEPT_PERMS.QUERY,
          onClick: () =>
            openDeptAuthorizationSurface({ deptId: row.id, deptCode: row.deptCode, deptName: row.deptName }),
        },
      ]"
      :teleported="dropdownTeleported"
      @click.stop
      @visible-change="handleDropdownVisibleChange"
    >
      <el-button class="ml-2!" link type="primary" @pointerdown.stop="lockRowForDropdown">
        {{ t('buttons.actionMore') }}
      </el-button>
    </AuthDropdown>
  </div>
</template>
