<script lang="ts" setup>
import DataScopeFormFields from '@/features/system/_shared/components/DataScopeFormFields.vue';
import { SYS_USER_PERMS } from '@/features/system/user/constants/permissions';
import useUserScopePanel from '@/features/system/user/workstation/hooks/role/use-user-scope-panel';
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
} = useUserScopePanel(userId, formRef);

const showForm = computed(() => hasOverride.value || draftEditing.value);

/**
 * 启用用户数据范围覆盖角色
 */
function enableOverrideDraft() {
  draftEditing.value = true;
  scopes.value = [];
  formRef.value?.clearValidate();
}

/**
 * 取消用户数据范围覆盖角色
 */
function cancelOverrideDraft() {
  draftEditing.value = false;
  scopes.value = [];
  formRef.value?.clearValidate();
}
</script>

<template>
  <div v-loading="loading">
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
    <div v-if="!showForm" class="pt-2 pb-4">
      <el-button v-auth="SYS_USER_PERMS.UPDATE" type="primary" @click="enableOverrideDraft">
        {{ t('users.scope.action.enableOverride') }}
      </el-button>
    </div>

    <el-form v-else ref="formRef" :model="{ scopes }" label-position="top">
      <el-divider content-position="left">{{ t('users.workstation.nav.grantScope') }}</el-divider>

      <DataScopeFormFields v-model="scopes" :dept-tree="deptTree" />

      <div class="flex justify-end">
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
