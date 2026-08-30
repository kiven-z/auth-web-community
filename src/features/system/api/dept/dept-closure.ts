import { http } from '@/core/http/client';

/**
 * 闭包健康度统计
 */
export interface DeptClosureHealthStats {
  onlySelf: number;
  hasAncestors: number;
  zeroClosure: number;
  total: number;
}

/**
 * 父子直连缺失异常行
 */
export interface DeptClosureParentLinkAnomaly {
  id: string;
  deptName: string;
  parentId: string;
  parentLinkStatus: string;
}

/**
 * 深度链条异常行
 */
export interface DeptClosureDepthChainAnomaly {
  id: string;
  deptName: string;
  parentId: string;
  childClosureCnt: number;
  parentClosureCnt: number;
  expectedChildCnt: number;
}

/**
 * 部门闭包表健康检查
 */
export interface DeptClosureHealth {
  passed: boolean;
  checkedAt: string;
  healthStats: DeptClosureHealthStats;
  missingParentLinkCount: number;
  parentLinkSampleTruncated: boolean;
  parentLinkAnomalies: DeptClosureParentLinkAnomaly[];
  depthChainAnomalyCount: number;
  depthChainSampleTruncated: boolean;
  depthChainAnomalies: DeptClosureDepthChainAnomaly[];
}

/**
 * 部门闭包表健康检查（只读运维）
 * @returns 健康检查结果
 */
export function getDeptClosureHealth(): Promise<DeptClosureHealth> {
  return http.get<DeptClosureHealth, unknown>('/system/dept/closure/health');
}
