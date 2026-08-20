import { expect, test } from '@playwright/test';

import { e2eBaseURL, e2ePaths, storageStatePaths } from '../../constants/paths';
import { isBackendReady } from '../../support/backend-ready';

test.skip(!isBackendReady(), 'Backend not reachable; start auth stack or set E2E_SKIP_IF_NO_BACKEND=1');

test.describe('route guard', () => {
  test('orphan_self is denied system user route and has no user menu', async ({ browser }) => {
    const context = await browser.newContext({
      baseURL: e2eBaseURL,
      locale: 'zh-CN',
      storageState: storageStatePaths.orphanSelf,
    });
    const page = await context.newPage();
    try {
      await page.goto(e2ePaths.welcome);
      await expect(page.locator('.el-menu').first()).toBeVisible();
      await expect(page.getByRole('menuitem', { name: '用户管理' })).toHaveCount(0);
      await expect(page.locator('.el-sub-menu').filter({ hasText: '系统管理' })).toHaveCount(0);

      await page.goto(e2ePaths.systemUser);
      const accessDenied = page.getByText('抱歉，你无权访问该页面');
      const notFound = page.getByText('抱歉，你访问的页面不存在');
      await expect(accessDenied.or(notFound)).toBeVisible();
      await expect(page.getByRole('button', { name: '添加' })).toHaveCount(0);
    } finally {
      await context.close();
    }
  });
});
