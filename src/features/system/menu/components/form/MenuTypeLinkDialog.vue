<script lang="ts" setup>
import type { MenuFormModel } from '@/features/system/api/menu/menu';
import { useI18n } from 'vue-i18n';

defineProps({
  formDisabled: { type: Boolean, default: false },
});

const formModel = defineModel<MenuFormModel>('form', { required: true });

const { t } = useI18n();
</script>

<template>
  <el-row :gutter="16" class="w-full">
    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.showLink')" prop="showLink">
        <el-switch
          v-model="formModel.showLink"
          :active-text="t('status.show')"
          :disabled="formDisabled"
          :inactive-text="t('status.hide')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.publicAccess')" prop="publicAccess">
        <el-switch
          v-model="formModel.publicAccess"
          :active-text="t('status.yes')"
          :disabled="formDisabled"
          :inactive-text="t('status.no')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.showParent')" prop="showParent">
        <el-switch
          v-model="formModel.showParent"
          :active-text="t('status.show')"
          :disabled="formDisabled"
          :inactive-text="t('status.hide')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.status')" prop="status">
        <el-switch
          v-model="formModel.status"
          :active-text="t('buttons.statusActiveText')"
          :active-value="true"
          :disabled="formDisabled"
          :inactive-text="t('buttons.statusInactiveText')"
          :inactive-value="false"
          class="status-switch"
          inline-prompt
        />
      </el-form-item>
    </el-col>
  </el-row>
</template>
