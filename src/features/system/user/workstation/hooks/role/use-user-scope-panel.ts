import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/components/domain/dept/dept-select-tree';
import { getDeptList } from '@/features/system/api/dept/dept';
import { toDataScopeForms, type SysDataScopeForm } from '@/features/system/api/models/data-scope';
import { deleteUserScope, getUserScope, upsertUserScope } from '@/features/system/api/user/user-scope';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { computed, type MaybeRefOrGetter, type Ref, ref, toValue, watch } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 用户工作台：数据范围覆盖面板状态与操作
 * @param userId 当前用户 ID
 * @param formRef 面板表单实例（由组件模板绑定）
 * @returns 面板状态、表单与动作
 */
function useUserScopePanel(userId: MaybeRefOrGetter<string>, formRef: Ref<FormInstance | undefined>) {
  const { t } = useI18n();

  const loading = ref(false);
  const submitting = ref(false);
  const clearing = ref(false);
  const deptTree = ref<DeptSelectTreeNode[]>([]);

  /** 是否已有用户级覆盖 */
  const hasOverride = ref(false);
  /** 继承态下是否进入编辑（启用覆盖，尚未保存） */
  const draftEditing = ref(false);

  const scopes = ref<SysDataScopeForm[]>([]);

  const resolvedUserId = computed(() => toValue(userId));

  /**
   * 加载部门树与当前用户范围
   */
  async function loadPanelData() {
    if (!resolvedUserId.value) {
      return;
    }

    loading.value = true;
    try {
      const [deptList, rows] = await Promise.all([getDeptList(), getUserScope(resolvedUserId.value)]);
      deptTree.value = buildDeptSelectTree(deptList ?? []);
      scopes.value = toDataScopeForms(rows);
      hasOverride.value = scopes.value.length > 0;
      draftEditing.value = false;
      formRef.value?.clearValidate();
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      loading.value = false;
    }
  }

  /**
   * 重置为上次成功快照；草稿态则回到空表单
   */
  function resetForm() {
    if (hasOverride.value) {
      void loadPanelData();
      return;
    }
    scopes.value = [];
    formRef.value?.clearValidate();
  }

  /**
   * 校验并保存用户级覆盖
   */
  async function handleSave() {
    if (!formRef.value || !resolvedUserId.value) {
      return;
    }

    const valid = await formRef.value.validate().catch(() => false);
    if (!valid) {
      return;
    }

    submitting.value = true;
    try {
      await Promise.all(scopes.value.map((row) => upsertUserScope(resolvedUserId.value, row)));
      message(t('tips.editSuccess'), { type: 'success' });
      hasOverride.value = scopes.value.length > 0;
      draftEditing.value = false;
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      submitting.value = false;
    }
  }

  /**
   * 清除用户级覆盖，恢复角色继承
   */
  async function handleClearOverride() {
    if (!resolvedUserId.value || !hasOverride.value) {
      return;
    }

    const confirmed = await operationConfirm();
    if (!confirmed) {
      return;
    }

    clearing.value = true;
    try {
      await deleteUserScope(resolvedUserId.value);
      message(t('users.scope.tips.cleared'), { type: 'success' });
      scopes.value = [];
      hasOverride.value = false;
      draftEditing.value = false;
      formRef.value?.clearValidate();
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      clearing.value = false;
    }
  }

  watch(resolvedUserId, () => void loadPanelData(), { immediate: true });

  return {
    scopes,
    loading,
    submitting,
    clearing,
    deptTree,
    hasOverride,
    draftEditing,
    resetForm,
    handleSave,
    handleClearOverride,
  };
}

export default useUserScopePanel;
