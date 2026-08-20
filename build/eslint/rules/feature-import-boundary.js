import path from 'node:path';

import { getBoundaryViolation, parseImportTarget, parseSourceContext } from '../feature-boundary-utils.js';

/**
 * @type {import('eslint').Rule.RuleModule}
 */
const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce feature import boundaries from filesystem layout',
    },
    schema: [],
    messages: {
      boundary: '{{ message }}',
    },
  },
  create(context) {
    const filename = context.filename;
    if (filename.includes('node_modules')) {
      return {};
    }

    const source = parseSourceContext(filename);

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        if (typeof importPath !== 'string') {
          return;
        }

        const target = parseImportTarget(importPath, filename);
        if (!target) {
          return;
        }

        const normalizedImport = importPath.startsWith('.') ? toAliasPath(importPath, filename) : importPath;

        const violation = getBoundaryViolation(source, target, normalizedImport);
        if (!violation) {
          return;
        }

        context.report({
          node: node.source,
          messageId: 'boundary',
          data: { message: violation },
        });
      },
    };
  },
};

/**
 * @param {string} importPath
 * @param {string} fromFile
 */
function toAliasPath(importPath, fromFile) {
  const resolved = path.resolve(path.dirname(fromFile), importPath);
  const normalized = resolved.replaceAll('\\', '/');
  const srcIndex = normalized.lastIndexOf('/src/');
  if (srcIndex === -1) {
    return importPath;
  }

  return `@/${normalized.slice(srcIndex + '/src/'.length)}`;
}

export default rule;
