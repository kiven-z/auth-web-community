import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

function discoverDomainApiModules() {
  const featuresDir = path.join(projectRoot, 'src/features');
  if (!fs.existsSync(featuresDir)) {
    return [];
  }

  return fs
    .readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(featuresDir, entry.name, 'api')))
    .map((entry) => entry.name)
    .sort();
}

export const COMPONENT_DEEP_IMPORT_PATTERN = {
  group: ['@/components/**/src', '@/components/**/src/**'],
  message: '只允许从组件包根引入（index.ts），禁止绕过 barrel 的深路径（含 @/components/.../src/...）',
};

export const VIEWS_FORBIDDEN_PATTERN = {
  group: ['@/views', '@/views/**'],
  message: '禁止 @/views；路由页面位于 @/features/<domain>/<leaf>/pages/...',
};

export const DOMAIN_API_AT_ROOT_PATTERN = {
  group: discoverDomainApiModules().flatMap((domain) => [`@/api/${domain}`, `@/api/${domain}/**`]),
  message: '域 API 位于 @/features/<domain>/api/...；平台仅保留 @/api/common 与 @/api/auth',
};
