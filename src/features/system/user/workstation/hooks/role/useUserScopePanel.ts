import { getDeptList } from '@/features/system/api/dept/dept';
import {
  deleteUserScope,
  getUserScope,
  type SysDataScopeForm,
  upsertUserScope,
} from '@/features/system/api/user/userScope';
import { operationConfirm } from '@/services/feedback/dialog';
import { errorMessage, message } from '@/services/feedback/message';
import { buildDeptSelectTree, type DeptSelectTreeNode } from '@/components/domain/dept/DeptSelectTree';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, type MaybeRefOrGetter, reactive, type Ref, ref, toValue, watch } from 'vue';
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

  const form = ref<SysDataScopeForm>({
    scopeType: 'SELF',
    scopeDeptIds: [],
  });

  const resolvedUserId = computed(() => toValue(userId));

  const rules = reactive<FormRules>({
    scopeType: [{ required: true, message: t('dataScope.field.type'), trigger: 'change' }],
    scopeDeptIds: [
      {
        required: true,
        validator: (_rule, value: string[], callback) => {
          if (form.value.scopeType !== 'DEPT' && form.value.scopeType !== 'DEPT_AND_CHILD') {
            callback();
            return;
          }
          if (!value?.length) {
            callback(new Error(t('dataScope.validation.scopeDeptIdsRequired')));
            return;
          }
          callback();
        },
        trigger: 'change',
      },
    ],
    remark: [{ max: 500, message: t('dataScope.validation.remarkMaxLength'), trigger: 'blur' }],
  });

  /**
   * 加载部门树与当前用户范围
   */
  async function loadPanelData() {
    if (!resolvedUserId.value) {
      return;
    }

    loading.value = true;
    try {
      const [deptList, scope] = await Promise.all([getDeptList(), getUserScope(resolvedUserId.value)]);
      // 数据范围：存在性校验（含停用），非计算有效门槛
      deptTree.value = buildDeptSelectTree(deptList ?? [], { disableMode: 'inactive' });

      if (scope) {
        form.value = {
          scopeType: scope.scopeType,
          scopeDeptIds: scope.scopeDeptIds,
          remark: scope.remark,
        };
        hasOverride.value = true;
      } else {
        form.value = { scopeType: 'SELF', scopeDeptIds: [] };
        hasOverride.value = false;
      }
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
    form.value = { scopeType: 'SELF', scopeDeptIds: [] };
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
      await upsertUserScope(resolvedUserId.value, form.value);
      message(t('tips.editSuccess'), { type: 'success' });
      hasOverride.value = true;
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
      form.value = { scopeType: 'SELF', scopeDeptIds: [] };
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
    form,
    rules,
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
