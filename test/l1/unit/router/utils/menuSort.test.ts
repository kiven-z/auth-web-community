import { filterNoPermissionTree } from '@/router/utils/menuSort';
import { describe, expect, it } from 'vitest';
import type { RouteComponent } from 'vue-router';

describe('filterNoPermissionTree', () => {
  it('keeps publicAccess routes regardless of roles', () => {
    const tree = [{ path: '/help', meta: { publicAccess: true, roles: ['admin'] } }] as RouteComponent[];

    expect(filterNoPermissionTree(tree, [])).toEqual(tree);
    expect(filterNoPermissionTree(tree, ['user'])).toEqual(tree);
  });

  it('keeps routes whose meta.roles intersect current roles', () => {
    const tree = [
      { path: '/admin', meta: { roles: ['admin'] } },
      { path: '/user', meta: { roles: ['user'] } },
    ] as RouteComponent[];

    expect(filterNoPermissionTree(tree, ['admin']).map((item: { path: string }) => item.path)).toEqual(['/admin']);
  });

  it('hides role-gated routes when current roles are empty', () => {
    const tree = [{ path: '/admin', meta: { roles: ['admin'] } }] as RouteComponent[];

    expect(filterNoPermissionTree(tree, [])).toEqual([]);
  });

  it('keeps routes without meta.roles (isOneOfArray treats missing list as visible)', () => {
    const tree = [{ path: '/open', meta: { title: 'open' } }] as RouteComponent[];

    expect(filterNoPermissionTree(tree, [])).toEqual(tree);
    expect(filterNoPermissionTree(tree, ['admin'])).toEqual(tree);
  });

  it('filters nested children with the same roles', () => {
    const tree = [
      {
        path: '/system',
        meta: { roles: ['admin'] },
        children: [
          { path: '/system/user', meta: { roles: ['admin'] } },
          { path: '/system/secret', meta: { roles: ['super'] } },
        ],
      },
    ] as RouteComponent[];

    const filtered = filterNoPermissionTree(tree, ['admin']) as Array<{
      path: string;
      children: Array<{ path: string }>;
    }>;

    expect(filtered).toHaveLength(1);
    expect(filtered[0].path).toBe('/system');
    expect(filtered[0].children.map((child) => child.path)).toEqual(['/system/user']);
  });
});
