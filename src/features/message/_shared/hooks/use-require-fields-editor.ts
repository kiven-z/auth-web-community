import {
  fromEditRows,
  parseRequireFieldsJson,
  type RequireFieldEditRow,
  toEditRows,
} from '@/features/message/_shared/utils/require-fields-codec';
import {
  getMessageTemplateRequireFields,
  updateMessageTemplateRequireFields,
} from '@/features/message/api/message-template';
import type { MessageChannelCode } from '@/features/message/api/models/message-template';
import { errorMessage, message } from '@/services/feedback/message';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

/** 必填变量编辑器参数 */
export interface UseRequireFieldsEditorOptions {
  id: string;
  channel: MessageChannelCode;
}

/**
 * 消息模板 require_fields 双编辑器（表格 / JSON）状态与提交
 * @param options 模板主键与渠道
 */
export function useRequireFieldsEditor(options: UseRequireFieldsEditorOptions) {
  const { t } = useI18n();

  const loading = ref(false);
  const activeTab = ref<'table' | 'json'>('table');
  const editRows = ref<RequireFieldEditRow[]>([]);
  const jsonText = ref('[]');
  let rowSeq = 1;

  /**
   * Tab 离开前同步投影；JSON 非法时阻止切回表格。
   * before-leave 触发时 v-model 尚未切换，activeTab 即离开侧。
   */
  const beforeLeave = (): boolean => {
    switch (activeTab.value) {
      case 'table': {
        jsonText.value = JSON.stringify(fromEditRows(editRows.value), null, 2);
        return true;
      }
      case 'json': {
        const parsed = parseRequireFieldsJson(jsonText.value);
        if (!parsed.ok) {
          message(t('messageTemplate.requireFieldsJsonInvalid'), { type: 'error' });
          return false;
        }
        editRows.value = toEditRows(parsed.rows);
        rowSeq = editRows.value.length + 1;
        return true;
      }
      default:
        return true;
    }
  };

  const onAdd = () => {
    editRows.value.push({
      uid: rowSeq++,
      key: '',
      description: '',
      exampleValue: '',
    });
  };

  /**
   * 删除编辑行
   * @param row 待删行
   */
  const onDel = (row: RequireFieldEditRow) => {
    const index = editRows.value.indexOf(row);
    if (index !== -1) {
      editRows.value.splice(index, 1);
    }
  };

  /**
   * 提交变量表
   * @returns 是否可关闭弹窗
   */
  const submit = async (): Promise<boolean> => {
    let requireFields = fromEditRows(editRows.value);

    if (activeTab.value === 'json') {
      const parsed = parseRequireFieldsJson(jsonText.value);
      if (!parsed.ok) {
        message(t('messageTemplate.requireFieldsJsonInvalid'), { type: 'error' });
        return false;
      }
      requireFields = parsed.rows;
    }

    try {
      await updateMessageTemplateRequireFields({
        id: options.id,
        channel: options.channel,
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
      const rows = await getMessageTemplateRequireFields(options.id, options.channel);
      editRows.value = toEditRows(rows ?? []);
      rowSeq = editRows.value.length + 1;
      jsonText.value = JSON.stringify(fromEditRows(editRows.value), null, 2);
    } catch (error: unknown) {
      errorMessage(error);
    } finally {
      loading.value = false;
    }
  });

  return {
    loading,
    activeTab,
    editRows,
    jsonText,
    beforeLeave,
    onAdd,
    onDel,
    submit,
  };
}
