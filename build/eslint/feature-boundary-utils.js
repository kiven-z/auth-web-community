import fs from 'node:fs';
import path from 'node:path';

/** @type {string | null} */
let projectRoot = null;

/** @type {Map<string, { denyImportPatterns: string[] } | null>} */
const boundaryConfigCache = new Map();

/**
 * @param {string} [cwd]
 */
export function setProjectRoot(cwd) {
  projectRoot = cwd ?? process.cwd();
  boundaryConfigCache.clear();
}

function resolveProjectRoot() {
  if (!projectRoot) {
    setProjectRoot(process.cwd());
  }
  return projectRoot;
}

function featuresRoot() {
  return path.join(resolveProjectRoot(), 'src/features');
}

/**
 * @param {string} filePath
 */
function normalizePath(filePath) {
  return filePath.replaceAll('\\', '/');
}

/**
 * @param {string} filename
 */
export function parseSourceContext(filename) {
  const normalized = normalizePath(filename);
  const srcIndex = normalized.lastIndexOf('/src/');
  if (srcIndex === -1) {
    return { role: 'misc' };
  }

  const relative = normalized.slice(srcIndex + '/src/'.length);

  if (relative.startsWith('api/') || relative.startsWith('auth/')) {
    return { role: 'auth-runtime' };
  }

  if (relative.startsWith('components/') || relative.startsWith('shared/') || relative.startsWith('core/')) {
    return { role: 'platform' };
  }

  const featureMatch = relative.match(/^features\/([^/]+)\/(.*)$/);
  if (!featureMatch) {
    return { role: 'misc' };
  }

  const feature = featureMatch[1];
  const rest = featureMatch[2];
  const firstSegment = rest.split('/')[0];

  if (firstSegment === 'api') {
    return { role: 'api', feature };
  }

  if (firstSegment === '_shared') {
    return { role: 'shared', feature };
  }

  if (firstSegment) {
    return { role: 'leaf', feature, leaf: firstSegment };
  }

  return { role: 'feature-root', feature };
}

/**
 * @param {string} importPath
 * @param {string} [fromFile]
 */
export function parseImportTarget(importPath, fromFile) {
  if (importPath.startsWith('@/')) {
    return parseAliasImport(importPath);
  }

  if (!importPath.startsWith('.') || !fromFile) {
    return null;
  }

  const resolved = path.resolve(path.dirname(fromFile), importPath);
  const normalized = normalizePath(resolved);
  const srcIndex = normalized.lastIndexOf('/src/');
  if (srcIndex === -1) {
    return null;
  }

  return parseAliasImport(`@/${normalized.slice(srcIndex + '/src/'.length)}`);
}

/**
 * @param {string} aliasPath
 */
function parseAliasImport(aliasPath) {
  if (!aliasPath.startsWith('@/features/')) {
    return null;
  }

  const rest = aliasPath.slice('@/features/'.length);
  const parts = rest.split('/').filter(Boolean);
  if (parts.length === 0) {
    return { area: 'feature', feature: '', kind: 'root' };
  }

  const feature = parts[0];
  const segment = parts[1];

  if (!segment) {
    return { area: 'feature', feature, kind: 'root' };
  }

  if (segment === 'api') {
    return { area: 'feature', feature, kind: 'api' };
  }

  if (segment === '_shared') {
    return { area: 'feature', feature, kind: 'shared' };
  }

  return { area: 'feature', feature, kind: 'leaf', leaf: segment };
}

/**
 * @param {string} pattern
 * @param {string} importPath
 */
function matchImportPattern(pattern, importPath) {
  const normalizedPattern = pattern.replaceAll('\\', '/');
  if (normalizedPattern.endsWith('/**')) {
    const prefix = normalizedPattern.slice(0, -3);
    return importPath === prefix || importPath.startsWith(`${prefix}/`);
  }

  return importPath === normalizedPattern;
}

/**
 * @param {ReturnType<typeof parseSourceContext>} source
 */
function loadBoundaryConfig(source) {
  if (source.role !== 'leaf' || !source.feature || !source.leaf) {
    return null;
  }

  const cacheKey = `${source.feature}/${source.leaf}`;
  if (boundaryConfigCache.has(cacheKey)) {
    return boundaryConfigCache.get(cacheKey);
  }

  const configPath = path.join(featuresRoot(), source.feature, source.leaf, '.boundary.json');
  if (!fs.existsSync(configPath)) {
    boundaryConfigCache.set(cacheKey, null);
    return null;
  }

  const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const config = {
    denyImportPatterns: Array.isArray(raw.denyImportPatterns) ? raw.denyImportPatterns : [],
  };
  boundaryConfigCache.set(cacheKey, config);
  return config;
}

/**
 * @param {string} importPath
 * @param {ReturnType<typeof parseSourceContext>} source
 */
function isDeniedByLocalConfig(importPath, source) {
  const config = loadBoundaryConfig(source);
  if (!config) {
    return null;
  }

  for (const pattern of config.denyImportPatterns) {
    if (matchImportPattern(pattern, importPath)) {
      return pattern;
    }
  }

  return null;
}

/**
 * @param {ReturnType<typeof parseSourceContext>} source
 * @param {NonNullable<ReturnType<typeof parseImportTarget>>} target
 * @param {string} importPath
 */
export function getBoundaryViolation(source, target, importPath) {
  const localDeny = isDeniedByLocalConfig(importPath, source);
  if (localDeny) {
    return `当前叶子模块禁止引用 ${importPath}（.boundary.json: ${localDeny}）`;
  }

  if (source.role === 'misc') {
    return null;
  }

  if (target.area !== 'feature') {
    return null;
  }

  if (source.role === 'auth-runtime') {
    return `api/common|auth 与 auth 运行时禁止依赖 features（${importPath}）`;
  }

  const isUi = target.kind === 'shared' || target.kind === 'leaf';

  if (source.role === 'platform') {
    if (isUi) {
      return `禁止依赖 @/features/${target.feature} 的 UI；跨域契约请用 @/features/${target.feature}/api`;
    }
    return null;
  }

  if (source.role === 'api') {
    if (isUi) {
      return `feature api 禁止依赖 UI（${importPath}）；请保持 api 层无界面耦合`;
    }
    return null;
  }

  if (source.role === 'shared') {
    if (source.feature === target.feature && target.kind === 'leaf') {
      return `_shared 禁止依赖叶子模块：不可引用 @/features/${target.feature}/${target.leaf}`;
    }
    if (source.feature !== target.feature && isUi) {
      return `禁止依赖 @/features/${target.feature} 的 UI；跨域契约请用 @/features/${target.feature}/api`;
    }
    return null;
  }

  if (source.role === 'leaf') {
    if (source.feature === target.feature && target.kind === 'leaf' && target.leaf !== source.leaf) {
      return `禁止同 feature 叶子互引：不可引用 @/features/${target.feature}/${target.leaf}；请抽到 @/features/${target.feature}/_shared`;
    }
    if (source.feature !== target.feature && isUi) {
      return `禁止依赖 @/features/${target.feature} 的 UI；跨域契约请用 @/features/${target.feature}/api`;
    }
    return null;
  }

  if (source.role === 'feature-root') {
    if (source.feature !== target.feature && isUi) {
      return `禁止依赖 @/features/${target.feature} 的 UI；跨域契约请用 @/features/${target.feature}/api`;
    }
  }

  return null;
}
