import type { MessageChannelCode } from '@/features/message/api/models/message-template';
import { addDrawer } from '@/components/ui/drawer';
import MessageTemplateRequireFieldsDialog from '@/features/message/_shared/components/MessageTemplateRequireFieldsDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface RequireFieldsExpose {
  submit: () => Promise<boolean>;
}

/**
 * 打开消息模板必填变量维护抽屉的参数
 */
export interface OpenMessageTemplateRequireFieldsOptions {
  /** 模板主键 */
  id: string;
  /** 消息渠道 */
  channel: MessageChannelCode;
  /** 保存成功后刷新列表 */
  fetchTableData: () => Promise<void>;
}

/**
 * 打开消息模板 require_fields 维护抽屉
 */
export function useOpenMessageTemplateRequireFields() {
  const { t } = useI18n();

  /**
   * 打开必填变量维护抽屉
   * @param options 打开参数
   */
  const openRequireFields = (options: OpenMessageTemplateRequireFieldsOptions) => {
    const { id, channel, fetchTableData } = options;
    const dialogRef = ref<RequireFieldsExpose | null>(null);

    addDrawer({
      title: t('messageTemplate.requireFieldsDialogTitle'),
      size: '100%',
      direction: 'ttb',
      resizable: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      showClose: true,
      contentRenderer: () => <MessageTemplateRequireFieldsDialog ref={dialogRef} id={id} channel={channel} />,
      beforeSure: async (done) => {
        const submitted = await dialogRef.value?.submit();
        if (!submitted) {
          return;
        }
        await fetchTableData();
        done();
      },
    });
  };

  return { openRequireFields };
}
