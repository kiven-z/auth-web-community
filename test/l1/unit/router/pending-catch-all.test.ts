import { pendingCatchAll, ROUTE_PENDING_NAME } from '@/router/pending-catch-all';
import { describe, expect, it } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';

describe('pendingCatchAll', () => {
  it('matches a dynamic path before that route is registered', () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [pendingCatchAll],
    });

    const resolved = router.resolve('/message/email-template');

    expect(resolved.name).toBe(ROUTE_PENDING_NAME);
    expect(resolved.matched).toHaveLength(1);
  });
});
