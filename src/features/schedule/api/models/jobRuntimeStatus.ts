/**
 * 调度任务运行态相关类型（Quartz 生命周期 / 最近一次执行结果）
 */

/** Quartz 调度器侧运行态 */
export type SysJobQuartzRuntimeStatus = 'NOT_REGISTERED' | 'IDLE' | 'RUNNING' | 'PENDING' | 'PAUSED' | 'ERROR';

/** 最近一次业务执行结果 */
export type SysJobLastExecutionStatus = 'SUCCESS' | 'FAILED' | 'UNKNOWN';
