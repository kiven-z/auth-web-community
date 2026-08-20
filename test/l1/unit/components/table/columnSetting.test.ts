import { describe, expect, it } from 'vitest';

import {
  collectManagedColumnLabels,
  collectVisibleManagedColumnLabels,
  filterVisibleColumns,
  getManagedColumnIndices,
  isSettingManagedColumn,
  reorderManagedColumns,
} from '../../../../../src/components/table/ListTable/src/utils/columnSetting';

describe('isSettingManagedColumn', () => {
  it('excludes selection, index and expand columns', () => {
    expect(isSettingManagedColumn({ type: 'selection', label: 'sel' })).toBe(false);
    expect(isSettingManagedColumn({ type: 'index', label: 'idx' })).toBe(false);
    expect(isSettingManagedColumn({ type: 'expand', label: 'exp' })).toBe(false);
  });

  it('includes business columns', () => {
    expect(isSettingManagedColumn({ label: 'name', prop: 'name' })).toBe(true);
    expect(isSettingManagedColumn({ label: 'age', prop: 'age' })).toBe(true);
  });
});

describe('filterVisibleColumns', () => {
  it('drops columns with hide true or hide() returning true', () => {
    const columns = [
      { label: 'a', hide: true },
      { label: 'b', hide: false },
      { label: 'c', hide: () => true },
      { label: 'd', hide: () => false },
    ] as TableColumnList;

    expect(filterVisibleColumns(columns).map((c) => c.label)).toEqual(['b', 'd']);
  });
});

describe('collectManagedColumnLabels', () => {
  it('skips unmanaged column types', () => {
    const columns = [
      { type: 'selection', label: 'sel' },
      { label: 'name', prop: 'name' },
      { label: 'age', prop: 'age' },
    ] as TableColumnList;

    expect(collectManagedColumnLabels(columns)).toEqual(['name', 'age']);
  });
});

describe('collectVisibleManagedColumnLabels', () => {
  it('skips hidden managed columns', () => {
    const columns = [
      { label: 'name', hide: true },
      { label: 'age', hide: false },
    ] as TableColumnList;

    expect(collectVisibleManagedColumnLabels(columns)).toEqual(['age']);
  });
});

describe('getManagedColumnIndices', () => {
  it('returns indices of business columns only', () => {
    const columns = [
      { type: 'selection', label: 'sel' },
      { label: 'a' },
      { type: 'index', label: 'idx' },
      { label: 'b' },
    ] as TableColumnList;

    expect(getManagedColumnIndices(columns)).toEqual([1, 3]);
  });
});

describe('reorderManagedColumns', () => {
  it('reorders managed slice in place', () => {
    const columns = [
      { type: 'selection', label: 'sel' },
      { label: 'a' },
      { label: 'b' },
      { label: 'c' },
    ] as TableColumnList;

    expect(reorderManagedColumns(columns, 0, 2)).toBe(true);
    expect(columns.map((c) => c.label)).toEqual(['sel', 'b', 'c', 'a']);
  });

  it('returns false when either side is fixed', () => {
    const columns = [{ label: 'a' }, { label: 'b', fixed: 'left' }, { label: 'c' }] as TableColumnList;

    expect(reorderManagedColumns(columns, 0, 1)).toBe(false);
    expect(columns.map((c) => c.label)).toEqual(['a', 'b', 'c']);
  });
});
