import fs from 'node:fs';
import path from 'node:path';

/**
 * 纯 barrel：index 仅 re-export，无包级运行时逻辑（如 Dialog 的 addDialog 不属于此类）。
 * @param {string} indexFile
 */
function isThinBarrelIndex(indexFile) {
  if (!fs.existsSync(indexFile)) {
    return false;
  }

  const source = fs.readFileSync(indexFile, 'utf8');
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim();

  if (!withoutComments) {
    return false;
  }

  const hasRuntimeLogic = /(?:^|\n)\s*(?:const|let|function)\s+/m.test(withoutComments);
  if (hasRuntimeLogic) {
    return false;
  }

  return /export\s+/.test(withoutComments);
}

/**
 * 组件包 src/** 禁止从纯 barrel index 引入，避免 index ↔ 实现文件在 Rollup 分 chunk 时循环依赖。
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow component package src files from importing their own thin barrel index',
    },
    schema: [],
    messages: {
      selfBarrel: '组件包内禁止从 index 引入（{{ importPath }}）；请改用相对路径，避免 Rollup chunk 循环依赖。',
    },
  },
  create(context) {
    const normalized = context.filename.replaceAll('\\', '/');
    const match = normalized.match(/src\/components\/(.+)\/src\//);
    if (!match) {
      return {};
    }

    const packagePath = match[1];
    const packageDir = path.resolve(path.dirname(normalized), '..');
    if (!isThinBarrelIndex(path.join(packageDir, 'index.ts'))) {
      return {};
    }

    const bannedRoot = `@/components/${packagePath}`;

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        if (importPath !== bannedRoot && !importPath.startsWith(`${bannedRoot}/`)) {
          return;
        }
        context.report({
          node: node.source,
          messageId: 'selfBarrel',
          data: { importPath },
        });
      },
    };
  },
};

export default rule;
