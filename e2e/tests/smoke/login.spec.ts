import { expect, test } from '@playwright/test';

import { e2eAccounts } from '../../constants/accounts';
import { LoginPage } from '../../pages/login.page';
import { isBackendReady } from '../../support/backend-ready';

test.describe('login smoke', () => {
  test.beforeEach(({}) => {
    test.skip(!isBackendReady(), 'Backend not reachable; start auth stack or set E2E_SKIP_IF_NO_BACKEND=1');
  });

  test('administrator can login, land on welcome, and logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(e2eAccounts.administrator.username, e2eAccounts.administrator.password);

    await expect(page).toHaveURL(/\/welcome/);
    await expect(page.getByRole('heading', { name: '色阶冒烟（开发期）' })).toBeVisible();

    await page
      .locator('.el-dropdown-link')
      .filter({ has: page.locator('.layout-toolbar__avatar') })
      .click();
    await page.getByRole('menuitem', { name: '退出系统' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('button', { name: '登录' })).toBeVisible();
  });
});
