import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const flagPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.backend-ready');

/** global-setup 写入的后端连通标记路径 */
export const backendReadyFlagPath = flagPath;

/** 后端是否已通过 preflight 探测 */
export function isBackendReady(): boolean {
  if (!existsSync(flagPath)) {
    return false;
  }
  return readFileSync(flagPath, 'utf8').trim() === '1';
}
