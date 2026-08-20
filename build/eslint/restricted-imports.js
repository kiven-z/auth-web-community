import { COMPONENT_DEEP_IMPORT_PATTERN, DOMAIN_API_AT_ROOT_PATTERN, VIEWS_FORBIDDEN_PATTERN } from './patterns.js';

/**
 * @param {Array<{ group: string[], message: string }>} [patterns]
 * @returns {[string, { patterns: object[] }]}
 */
export function restrictedImports(patterns = []) {
  return [
    'error',
    {
      patterns: [COMPONENT_DEEP_IMPORT_PATTERN, VIEWS_FORBIDDEN_PATTERN, DOMAIN_API_AT_ROOT_PATTERN, ...patterns],
    },
  ];
}
