import { expect, test } from '@playwright/test';

import { e2ePaths } from '../../constants/paths';
import { isBackendReady } from '../../support/backend-ready';

test.describe('auth guard', () => {
  test.beforeEach(() => {
    test.skip(!isBackendReady(), 'Backend not reachable; start auth stack or set E2E_SKIP_IF_NO_BACKEND=1');
  });

  test('unauthenticated visit to protected route redirects to login', async ({ page }) => {
    await page.goto(e2ePaths.systemUser);

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible();
  });
});
