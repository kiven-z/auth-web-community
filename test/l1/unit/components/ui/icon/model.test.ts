import { describe, expect, it } from 'vitest';
import {
  pageForIcon,
  parseIconModelValue,
  type IconCollectionMap,
} from '../../../../../../src/components/ui/icon/icon-select/model';

const map: IconCollectionMap = {
  'ri:': ['home', 'user', 'settings', 'search', 'mail'],
  'ep:': ['plus', 'minus', 'edit'],
};

describe('parseIconModelValue', () => {
  it('parses slash keys and normalizes collection', () => {
    expect(parseIconModelValue('ep/plus')).toEqual({ collection: 'ep:', iconName: 'plus' });
    expect(parseIconModelValue('ep:/plus')).toEqual({ collection: 'ep:', iconName: 'plus' });
    expect(parseIconModelValue('ri/home')).toEqual({ collection: 'ri:', iconName: 'home' });
    expect(parseIconModelValue('ri:/home')).toEqual({ collection: 'ri:', iconName: 'home' });
    expect(parseIconModelValue('fa/legacy')).toEqual({ collection: 'ri:', iconName: 'legacy' });
  });

  it('returns null when slash form is invalid', () => {
    expect(parseIconModelValue('')).toBeNull();
    expect(parseIconModelValue('noslash')).toBeNull();
    expect(parseIconModelValue('/only-name')).toBeNull();
  });
});

describe('pageForIcon', () => {
  it('resolves page for known icon and falls back to 1 when missing', () => {
    expect(pageForIcon(map['ri:'], 'settings', 2)).toBe(2);
    expect(pageForIcon(map['ri:'], 'missing', 2)).toBe(1);
  });
});
