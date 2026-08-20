import { expect, test as setup } from '@playwright/test';

import { e2eAccounts } from './constants/accounts';
import { storageStatePaths } from './constants/paths';
import { LoginPage } from './pages/login.page';
import { isBackendReady } from './support/backend-ready';

// 在声明期 skip，避免后端不可达时仍拉起 browser fixture
setup.skip(!isBackendReady(), 'Backend not reachable; see e2e/global-setup.ts');

setup('authenticate as administrator', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(e2eAccounts.administrator.username, e2eAccounts.administrator.password);
  await expect(page).toHaveURL(/\/welcome/);
  await page.context().storageState({ path: storageStatePaths.administrator });
});

setup('authenticate as orphan_self', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(e2eAccounts.orphanSelf.username, e2eAccounts.orphanSelf.password);
  await expect(page).toHaveURL(/\/(welcome|\/?)$/);
  await page.context().storageState({ path: storageStatePaths.orphanSelf });
});
