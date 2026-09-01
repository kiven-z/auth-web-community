<script lang="ts" setup>
import type {
  MessageChannelCode,
  MessageTemplateRequireFieldRow,
} from '@/features/message/api/models/message-template';
import {
  getMessageTemplateRequireFields,
  updateMessageTemplateRequireFields,
} from '@/features/message/api/message-template';
import { errorMessage, message } from '@/services/feedback/message';
import { MESSAGE_TEMPLATE_PERMS } from '@/features/message/_shared/constants/permissions';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'MessageTemplateRequireFieldsDialog',
});

/** 消息模板变量表编辑弹窗 props */
interface MessageTemplateRequireFieldsDialogProps {
  id: string;
  channel: MessageChannelCode;
}

const props = defineProps<MessageTemplateRequireFieldsDialogProps>();

const { t } = useI18n();

const loading = ref(false);
const dataList = ref<(MessageTemplateRequireFieldRow & { _id: number })[]>([]);
let rowSeq = 1;

/**
 * 添加行
 */
const onAdd = () => {
  dataList.value.push({
    _id: rowSeq++,
    key: '',
    description: '',
    exampleValue: '',
  });
};

/**
 * 删除行
 * @param row 待删除行
 */
const onDel = (row: MessageTemplateRequireFieldRow & { _id: number }) => {
  const index = dataList.value.indexOf(row);
  if (index !== -1) {
    dataList.value.splice(index, 1);
  }
};

/**
 * 校验并提交变量表
 * @returns 是否可关闭弹窗
 */
const submit = async (): Promise<boolean> => {
  try {
    await updateMessageTemplateRequireFields({
      id: props.id,
      channel: props.channel,
      requireFields: dataList.value,
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
    dataList.value = (requireFields ?? []).map((row, index) => ({
      _id: index + 1,
      ...row,
    }));
    rowSeq = dataList.value.length + 1;
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
    <el-table
      :data="dataList"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)',
      }"
      :row-key="(row) => String(row._id)"
      border
      class="w-full"
    >
      <el-table-column :label="t('messageTemplate.fieldKey')" min-width="120">
        <template #default="{ row }">
          <el-input v-model="row.key" :placeholder="t('messageTemplate.placeholder.fieldKey')" clearable />
        </template>
      </el-table-column>
      <el-table-column :label="t('messageTemplate.fieldDescription')" min-width="140">
        <template #default="{ row }">
          <el-input
            v-model="row.description"
            :placeholder="t('messageTemplate.placeholder.fieldDescription')"
            clearable
          />
        </template>
      </el-table-column>
      <el-table-column :label="t('messageTemplate.fieldExampleValue')" min-width="200">
        <template #default="{ row }">
          <el-input
            v-model="row.exampleValue"
            :autosize="{ minRows: 1, maxRows: 4 }"
            :placeholder="t('messageTemplate.placeholder.fieldExampleValue')"
            type="textarea"
          />
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
    <el-button v-auth="MESSAGE_TEMPLATE_PERMS.UPDATE" class="w-full mt-2!" plain type="primary" @click="onAdd">
      {{ t('buttons.actionAdd') }}
    </el-button>
  </div>
</template>

<style scoped>
.require-fields-dialog-inner {
  min-height: 240px;
}
</style>
