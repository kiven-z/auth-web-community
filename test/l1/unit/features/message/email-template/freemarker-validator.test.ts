import { describe, expect, it } from 'vitest';
import {
  collectFreemarkerLocalVariables,
  collectUnknownVariableMarkers,
  getRootVariableName,
} from '@/features/message/email-template/monaco/validator';

describe('getRootVariableName', () => {
  it('extracts simple root variable', () => {
    expect(getRootVariableName('user')).toBe('user');
  });

  it('extracts root before property path', () => {
    expect(getRootVariableName('user.name')).toBe('user');
  });

  it('trims FreeMarker expression prefixes', () => {
    expect(getRootVariableName('!user')).toBe('user');
    expect(getRootVariableName('(user')).toBe('user');
  });

  it('returns null for keywords', () => {
    expect(getRootVariableName('if')).toBeNull();
    expect(getRootVariableName('list')).toBeNull();
  });

  it('returns null when name starts with a digit', () => {
    expect(getRootVariableName('1user')).toBeNull();
  });

  it('allows underscore and digits after first char', () => {
    expect(getRootVariableName('_foo2')).toBe('_foo2');
  });
});

describe('collectFreemarkerLocalVariables', () => {
  it('collects #list as aliases', () => {
    const keys = collectFreemarkerLocalVariables('<#list users as item>${item}</#list>');
    expect(keys.has('item')).toBe(true);
  });

  it('collects #assign / #local / #global names', () => {
    const text = `
      <#assign title = "x">
      <#local tmp = 1>
      <#global appName = "auth">
    `;
    const keys = collectFreemarkerLocalVariables(text);
    expect(keys).toEqual(new Set(['title', 'tmp', 'appName']));
  });

  it('ignores unrelated text', () => {
    expect(collectFreemarkerLocalVariables('hello ${user}')).toEqual(new Set());
  });
});

describe('collectUnknownVariableMarkers', () => {
  it('flags variables missing from require fields and locals', () => {
    const issues = collectUnknownVariableMarkers('Hi ${user.name} and ${missing}', new Set(['user']));
    expect(issues.map((i) => i.name)).toEqual(['missing']);
  });

  it('skips locals and known keys', () => {
    const text = '<#list rows as row>${row.id}${known}</#list>';
    const locals = collectFreemarkerLocalVariables(text);
    const issues = collectUnknownVariableMarkers(text, new Set(['known']), locals);
    expect(issues).toEqual([]);
  });
});
