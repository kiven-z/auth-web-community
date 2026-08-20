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
      <el-form-item :label="t('menus.component')" prop="component">
        <el-input
          v-model="formModel.component"
          :disabled="formDisabled"
          :placeholder="t('menus.placeholder.component')"
          clearable
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.redirect')" prop="redirect">
        <el-input
          v-model="formModel.redirect"
          :disabled="formDisabled"
          :placeholder="t('menus.placeholder.redirect')"
          clearable
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.activePath')" prop="activePath">
        <el-input
          v-model="formModel.activePath"
          :disabled="formDisabled"
          :placeholder="t('menus.placeholder.activePath')"
          clearable
        />
      </el-form-item>
    </el-col>

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
      <el-form-item :label="t('menus.keepAlive')" prop="keepAlive">
        <el-switch
          v-model="formModel.keepAlive"
          :active-text="t('status.cache')"
          :disabled="formDisabled"
          :inactive-text="t('status.unCache')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.hiddenTag')" prop="hiddenTag">
        <el-switch
          v-model="formModel.hiddenTag"
          :active-text="t('buttons.forbidText')"
          :disabled="formDisabled"
          :inactive-text="t('buttons.permitText')"
          inline-prompt
        />
      </el-form-item>
    </el-col>

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.fixedTag')" prop="fixedTag">
        <el-switch
          v-model="formModel.fixedTag"
          :active-text="t('buttons.fixedText')"
          :disabled="formDisabled"
          :inactive-text="t('buttons.unFixedText')"
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

    <el-col :lg="8" :md="12" :sm="12" :xs="24">
      <el-form-item :label="t('menus.dynamicLevel')" prop="dynamicLevel">
        <el-input-number
          v-model="formModel.dynamicLevel"
          :disabled="formDisabled"
          :max="999"
          :min="1"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>
    </el-col>
  </el-row>
</template>
