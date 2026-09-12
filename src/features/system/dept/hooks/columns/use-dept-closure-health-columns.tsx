import { formatDateTime } from '@/shared/utils/date/date-time';
import { ElTag } from 'element-plus';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 部门闭包表健康检查列定义
 * @returns 部门闭包表健康检查列定义
 */
function useDeptClosureHealthColumns() {
  const { t } = useI18n();

  // 概览列
  const summaryColumns = computed(() => [
    {
      label: t('dept.closureHealth.field.passed'),
      prop: 'passed',
      labelWidth: 140,
      cellRenderer: ({ value }) =>
        value ? (
          <ElTag type="success" effect="plain">
            {t('status.passedYes')}
          </ElTag>
        ) : (
          <ElTag type="danger" effect="plain">
            {t('status.passedNo')}
          </ElTag>
        ),
    },
    {
      label: t('dept.closureHealth.field.checkedAt'),
      prop: 'checkedAt',
      labelWidth: 140,
      cellRenderer: ({ value }) => formatDateTime(value),
    },
    { label: t('dept.closureHealth.field.missingParentLink'), prop: 'missingParentLinkCount', labelWidth: 140 },
    { label: t('dept.closureHealth.field.depthChain'), prop: 'depthChainAnomalyCount', labelWidth: 140 },
    {
      label: t('dept.closureHealth.field.parentLinkTruncated'),
      prop: 'parentLinkSampleTruncated',
      labelWidth: 140,
      cellRenderer: ({ value }) => <span>{value ? t('status.yes') : t('status.no')}</span>,
    },
    {
      label: t('dept.closureHealth.field.depthChainTruncated'),
      prop: 'depthChainSampleTruncated',
      labelWidth: 140,
      cellRenderer: ({ value }) => <span>{value ? t('status.yes') : t('status.no')}</span>,
    },
  ]);

  // 健康度统计列
  const healthStatsColumns = computed(() => [
    { label: t('dept.closureHealth.field.onlySelf'), prop: 'onlySelf', labelWidth: 140 },
    { label: t('dept.closureHealth.field.hasAncestors'), prop: 'hasAncestors', labelWidth: 140 },
    { label: t('dept.closureHealth.field.zeroClosure'), prop: 'zeroClosure', labelWidth: 140 },
    { label: t('dept.closureHealth.field.total'), prop: 'total', labelWidth: 140 },
  ]);

  // 父子直连异常样本列
  const parentLinkColumns = computed(() => [
    { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120 },
    { label: 'ID', prop: 'id', labelWidth: 120, copy: true },
    { label: t('dept.field.parentDept'), prop: 'parentId', labelWidth: 120, copy: true },
    { label: t('dept.closureHealth.field.linkStatus'), prop: 'parentLinkStatus', labelWidth: 160 },
  ]);

  // 深度链条异常样本列
  const depthChainColumns = computed(() => [
    { label: t('dept.field.deptName'), prop: 'deptName', labelWidth: 120 },
    { label: 'ID', prop: 'id', labelWidth: 120, copy: true },
    { label: t('dept.field.parentDept'), prop: 'parentId', labelWidth: 120, copy: true },
    { label: t('dept.closureHealth.field.childCnt'), prop: 'childClosureCnt', labelWidth: 120 },
    { label: t('dept.closureHealth.field.parentCnt'), prop: 'parentClosureCnt', labelWidth: 120 },
    { label: t('dept.closureHealth.field.expectedCnt'), prop: 'expectedChildCnt', labelWidth: 120 },
  ]);

  return {
    summaryColumns,
    healthStatsColumns,
    parentLinkColumns,
    depthChainColumns,
  };
}

export default useDeptClosureHealthColumns;
