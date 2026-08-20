<script lang="ts" setup>
import type { FormDialog } from '@/shared/types/dialog';
import type { UserPostAssignForm, UserPostRelationUpdateForm } from '@/features/system/api/user/user-post';
import useRemotePostSearch from '@/components/domain/post/RemotePostSearch';
import { useOverlayConfirm } from '@/components/ui/Overlay';
import type { FormInstance, FormRules } from 'element-plus';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

type UserPostAssignFormDialogProps = FormDialog<UserPostAssignForm | UserPostRelationUpdateForm> & {
  /** 编辑模式不展示岗位选择 */
  editMode?: boolean;
};

const props = withDefaults(defineProps<UserPostAssignFormDialogProps>(), {
  form: () => ({}) as UserPostAssignForm,
  editMode: false,
});

const { t } = useI18n();
const confirmOverlay = useOverlayConfirm();
const formRef = ref<FormInstance>();
const form = ref<UserPostAssignForm>({
  isPrimary: false,
  ...props.form,
});

const { postOptions, postSearchLoading, loadPostListByKeyword } = useRemotePostSearch();

const rules = computed<FormRules>(() => {
  const baseRules: FormRules = {
    isPrimary: [{ required: true, message: t('post.field.isPrimaryPosition'), trigger: 'change' }],
  };
  if (!props.editMode) {
    baseRules.postId = [{ required: true, message: t('post.field.postName'), trigger: 'change' }];
  }
  return baseRules;
});

defineExpose({ formRef, form });
</script>

<template>
  <el-form ref="formRef" v-enter-submit="() => confirmOverlay?.()" :model="form" :rules="rules" label-width="auto">
    <el-row :gutter="14">
      <!-- 岗位（仅新增） -->
      <el-col v-if="!editMode" :span="12">
        <el-form-item :label="t('post.field.postName')" prop="postId">
          <el-select
            v-model="form.postId"
            :loading="postSearchLoading"
            :placeholder="t('users.postAssign.searchPlaceholder')"
            :remote-method="loadPostListByKeyword"
            class="w-full"
            clearable
            filterable
            remote
          >
            <el-option
              v-for="item in postOptions"
              :key="item.id"
              :label="`${item.postName} (${item.postCode}) · ${item.deptName}`"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="t('post.field.isPrimaryPosition')" prop="isPrimary">
          <el-radio-group v-model="form.isPrimary">
            <el-radio :value="true">{{ t('post.enums.primary.yes') }}</el-radio>
            <el-radio :value="false">{{ t('post.enums.primary.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="t('users.field.remark')" prop="remark">
          <el-input
            v-model="form.remark"
            :placeholder="t('users.field.remark')"
            :rows="3"
            maxlength="255"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
