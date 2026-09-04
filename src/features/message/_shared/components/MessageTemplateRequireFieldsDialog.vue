<script lang="ts" setup>
import { MESSAGE_TEMPLATE_PERMS } from '@/features/message/_shared/constants/permissions';
import {
  getMessageTemplateRequireFields,
  updateMessageTemplateRequireFields,
} from '@/features/message/api/message-template';
import type {
  MessageChannelCode,
  MessageTemplateRequireFieldRow,
} from '@/features/message/api/models/message-template';
import { errorMessage, message } from '@/services/feedback/message';
import type { FormInstance } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageTemplateRequireFieldsDialog',
});

/** 消息模板变量表编辑弹窗 props */
interface MessageTemplateRequireFieldsDialogProps {
  id: string;
  channel: MessageChannelCode;
}

/** 编辑行：契约字段 + 表格稳定 key */
interface RequireFieldEditRow {
  uid: number;
  key: string;
  description?: string;
  exampleValue: string;
}

interface RequireFieldsForm {
  requireFields: RequireFieldEditRow[];
}

const props = defineProps<MessageTemplateRequireFieldsDialogProps>();

const { t } = useI18n();

const loading = ref(false);
const formRef = ref<FormInstance>();
const form = reactive<RequireFieldsForm>({
  requireFields: [],
});
let rowSeq = 1;

/**
 * 添加行
 */
const onAdd = () => {
  form.requireFields.push({
    uid: rowSeq++,
    key: '',
    description: '',
    exampleValue: '',
  });
};

/**
 * 删除行
 * @param row 待删除行
 */
const onDel = (row: RequireFieldEditRow) => {
  const index = form.requireFields.indexOf(row);
  if (index !== -1) {
    form.requireFields.splice(index, 1);
  }
};

/**
 * 校验并提交变量表
 * @returns 是否可关闭弹窗
 */
const submit = async (): Promise<boolean> => {
  try {
    await formRef.value?.validate();
  } catch {
    return false;
  }

  const requireFields: MessageTemplateRequireFieldRow[] = form.requireFields.map(
    ({ key, description, exampleValue }) => ({ key, description, exampleValue })
  );

  try {
    await updateMessageTemplateRequireFields({
      id: props.id,
      channel: props.channel,
      requireFields,
    });
    message(t('tips.editSuccess'), { type: 'success' });
    return true;
  } catch (error: unknown) {
    errorMessage(error);
    return false;
  }
};

onMounted(async () => {
  loading.value = true;
  try {
    const requireFields = await getMessageTemplateRequireFields(props.id, props.channel);
    form.requireFields = (requireFields ?? []).map((row, index) => ({
      uid: index + 1,
      key: row.key,
      description: row.description,
      exampleValue: row.exampleValue == null ? '' : String(row.exampleValue),
    }));
    rowSeq = form.requireFields.length + 1;
  } catch (error: unknown) {
    errorMessage(error);
  } finally {
    loading.value = false;
  }
});

defineExpose({ submit });
</script>

<template>
  <div v-loading="loading" class="require-fields-dialog-inner">
    <el-form ref="formRef" :model="form">
      <el-table
        :data="form.requireFields"
        :header-cell-style="{
          background: 'var(--el-fill-color-light)',
          color: 'var(--el-text-color-primary)',
        }"
        :row-key="(row: RequireFieldEditRow) => String(row.uid)"
        border
        class="w-full"
      >
        <el-table-column :label="t('messageTemplate.fieldKey')" min-width="140">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`requireFields.${$index}.key`"
              :rules="[{ required: true, message: t('messageTemplate.placeholder.fieldKey'), trigger: 'blur' }]"
              class="mb-0!"
            >
              <el-input v-model="row.key" :placeholder="t('messageTemplate.placeholder.fieldKey')" clearable />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="t('messageTemplate.fieldDescription')" min-width="140">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`requireFields.${$index}.description`"
              :rules="[{ required: true, message: t('messageTemplate.placeholder.fieldDescription'), trigger: 'blur' }]"
              class="mb-0!"
            >
              <el-input
                v-model="row.description"
                :placeholder="t('messageTemplate.placeholder.fieldDescription')"
                clearable
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="t('messageTemplate.fieldExampleValue')" min-width="200">
          <template #default="{ row, $index }">
            <el-form-item
              :prop="`requireFields.${$index}.exampleValue`"
              :rules="[
                { required: true, message: t('messageTemplate.placeholder.fieldExampleValue'), trigger: 'blur' },
              ]"
              class="mb-0!"
            >
              <el-input
                v-model="row.exampleValue"
                :autosize="{ minRows: 1, maxRows: 4 }"
                :placeholder="t('messageTemplate.placeholder.fieldExampleValue')"
                type="textarea"
              />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column :label="t('table.actions')" align="center" fixed="right" width="100">
          <template #default="{ row }">
            <el-button v-auth="MESSAGE_TEMPLATE_PERMS.UPDATE" link type="danger" @click="onDel(row)">
              {{ t('buttons.actionDelete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <el-button v-auth="MESSAGE_TEMPLATE_PERMS.UPDATE" class="w-full mt-2!" plain type="primary" @click="onAdd">
      {{ t('buttons.actionAdd') }}
    </el-button>
  </div>
</template>

<style scoped>
.require-fields-dialog-inner {
  min-height: 240px;

  :deep(.el-form-item__error) {
    position: static;
  }
}
</style>
