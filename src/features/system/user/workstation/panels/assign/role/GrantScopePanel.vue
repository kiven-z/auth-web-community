<script lang="ts" setup>
import DataScopeFormFields from '@/features/system/_shared/components/DataScopeFormFields.vue';
import { SYS_USER_PERMS } from '@/features/system/user/constants/permissions';
import useUserScopePanel from '@/features/system/user/workstation/hooks/role/useUserScopePanel';
import type { FormInstance } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

defineOptions({ name: 'UserWorkstationGrantScopePanel' });

const { t } = useI18n();
const route = useRoute();

const userId = computed(() => String(route.params.userId ?? ''));
const formRef = ref<FormInstance>();

const {
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
} = useUserScopePanel(userId, formRef);

const showForm = computed(() => hasOverride.value || draftEditing.value);

/** 继承态：进入覆盖编辑 */
function enableOverrideDraft() {
  draftEditing.value = true;
  form.value = { scopeType: 'SELF', scopeDeptIds: [] };
  formRef.value?.clearValidate();
}

/** 取消覆盖草稿，回到继承空态 */
function cancelOverrideDraft() {
  draftEditing.value = false;
  form.value = { scopeType: 'SELF', scopeDeptIds: [] };
  formRef.value?.clearValidate();
}
</script>

<template>
  <div v-loading="loading" class="grant-scope-panel">
    <!-- 当前来源：继承角色 -->
    <el-alert
      v-if="!hasOverride && !draftEditing"
      :closable="false"
      :title="t('users.scope.tips.inheritRole')"
      class="mb-4"
      show-icon
      type="success"
    />

    <!-- 当前来源：用户级覆盖 -->
    <el-alert
      v-else-if="hasOverride"
      :closable="false"
      :title="t('users.scope.tips.overrideActive')"
      class="mb-4"
      show-icon
      type="warning"
    />

    <!-- 继承空态：启用覆盖 -->
    <div v-if="!showForm" class="grant-scope-panel__empty">
      <el-button v-auth="SYS_USER_PERMS.UPDATE" type="primary" @click="enableOverrideDraft">
        {{ t('users.scope.action.enableOverride') }}
      </el-button>
    </div>

    <el-form v-else ref="formRef" :model="form" :rules="rules" label-position="top">
      <el-divider content-position="left">{{ t('users.workstation.nav.grantScope') }}</el-divider>

      <DataScopeFormFields v-model="form" :dept-tree="deptTree" />

      <div class="grant-scope-panel__actions">
        <el-button v-auth="SYS_USER_PERMS.UPDATE" :loading="submitting" type="primary" @click="handleSave">
          {{ t('account.action.save') }}
        </el-button>
        <el-button :disabled="submitting || clearing" @click="resetForm">
          {{ t('account.action.reset') }}
        </el-button>
        <el-button v-if="draftEditing && !hasOverride" :disabled="submitting" @click="cancelOverrideDraft">
          {{ t('users.scope.action.cancelDraft') }}
        </el-button>
        <el-button
          v-if="hasOverride"
          v-auth="SYS_USER_PERMS.UPDATE"
          :loading="clearing"
          type="danger"
          @click="handleClearOverride"
        >
          {{ t('users.scope.action.clearOverride') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.grant-scope-panel {
  &__empty {
    display: flex;
    justify-content: flex-start;
    padding: 8px 0 16px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;

    .el-button {
      padding: 0 36px;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .mb-4 {
    margin-bottom: 1rem;
  }
}
</style>
