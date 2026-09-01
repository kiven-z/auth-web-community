import { describe, expect, it } from 'vitest';
import { nextTick, ref } from 'vue';

import { useAssignModel } from '@/features/system/_shared/hooks/use-assign-model';

function clickEvent(): Event {
  return {
    target: { closest: () => null },
  } as unknown as Event;
}

describe('useAssignModel', () => {
  it('rebuilds keys and labels from assigned seed', () => {
    const { selectedKeys, labels, applyAssigned } = useAssignModel({
      getRowLabel: (row) => String(row.name ?? ''),
    });

    applyAssigned([
      { key: '1', label: 'Alpha' },
      { key: '1', label: 'dup' },
      { key: '  ', label: 'blank' },
      { key: '2', label: '  ' },
    ]);

    expect(selectedKeys.value).toEqual(['1', '2']);
    expect(labels.value).toEqual({ '1': 'Alpha', '2': '2' });
  });

  it('toggles selection and writes the row label', () => {
    const { selectedKeys, labels, isSelected, toggle } = useAssignModel({
      getRowLabel: (row) => String(row.name ?? ''),
    });
    const row = { id: '9', name: 'Nine' };

    toggle(row);
    expect(isSelected(row)).toBe(true);
    expect(selectedKeys.value).toEqual(['9']);
    expect(labels.value['9']).toBe('Nine');

    toggle(row);
    expect(isSelected(row)).toBe(false);
    expect(selectedKeys.value).toEqual([]);
  });

  it('fills missing labels from the current page without overwriting real names', async () => {
    const rows = ref<Record<string, unknown>[]>([{ id: '1', name: 'FromPage' }]);
    const { selectedKeys, labels, applyAssigned } = useAssignModel({
      getRowLabel: (row) => String(row.name ?? ''),
      rows,
    });

    applyAssigned([{ key: '1', label: '1' }]);
    await nextTick();
    expect(labels.value['1']).toBe('FromPage');
    expect(selectedKeys.value).toEqual(['1']);

    rows.value = [{ id: '1', name: 'LaterName' }];
    await nextTick();
    expect(labels.value['1']).toBe('FromPage');
  });

  it('shares an external selectedKeys ref for v-model', () => {
    const selectedKeys = ref<string[]>(['keep']);
    const model = useAssignModel({
      selectedKeys,
      getRowLabel: (row) => String(row.name ?? ''),
    });

    expect(model.selectedKeys).toBe(selectedKeys);
    model.toggle({ id: 'keep', name: 'Keep' });
    expect(selectedKeys.value).toEqual([]);
  });

  it('selects and deselects the current page', () => {
    const rows = ref<Record<string, unknown>[]>([
      { id: '1', name: 'One' },
      { id: '2', name: 'Two' },
    ]);
    const { selectedKeys, isPageFullySelected, isPageIndeterminate, togglePage } = useAssignModel({
      getRowLabel: (row) => String(row.name ?? ''),
      rows,
    });

    expect(isPageFullySelected.value).toBe(false);
    expect(isPageIndeterminate.value).toBe(false);

    togglePage();
    expect(selectedKeys.value).toEqual(['1', '2']);
    expect(isPageFullySelected.value).toBe(true);
    expect(isPageIndeterminate.value).toBe(false);

    togglePage();
    expect(selectedKeys.value).toEqual([]);
  });

  it('toggles selection on row click', () => {
    const rows = ref<Record<string, unknown>[]>([{ id: '1', name: 'One' }]);
    const { selectedKeys, handleRowClick } = useAssignModel({
      getRowLabel: (row) => String(row.name ?? ''),
      rows,
    });

    handleRowClick(rows.value[0]!, null, clickEvent());
    expect(selectedKeys.value).toEqual(['1']);

    handleRowClick(rows.value[0]!, null, clickEvent());
    expect(selectedKeys.value).toEqual([]);
  });

  it('ignores row click while disabled', () => {
    const rows = ref<Record<string, unknown>[]>([{ id: '1', name: 'One' }]);
    const disabled = ref(true);
    const { selectedKeys, handleRowClick, togglePage } = useAssignModel({
      getRowLabel: (row) => String(row.name ?? ''),
      rows,
      disabled,
    });

    handleRowClick(rows.value[0]!, null, clickEvent());
    togglePage();
    expect(selectedKeys.value).toEqual([]);
  });
});
