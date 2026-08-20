import { expect, test } from '@playwright/test';

import { e2eAccounts } from '../../constants/accounts';
import { e2eBaseURL } from '../../constants/paths';
import { LoginPage } from '../../pages/login.page';
import { SystemOnlineUserPage } from '../../pages/system-online-user.page';
import { isBackendReady } from '../../support/backend-ready';

/** 覆盖 authenticated project 默认的 administrator storageState，得到干净游客上下文 */
const guestStorageState = { cookies: [], origins: [] };

test.describe('online user kick', () => {
  test.beforeEach(() => {
    test.skip(!isBackendReady(), 'Backend not reachable; start auth stack or set E2E_SKIP_IF_NO_BACKEND=1');
  });

  test('administrator kick invalidates target session', async ({ browser, page }) => {
    const victimContext = await browser.newContext({
      baseURL: e2eBaseURL,
      locale: 'zh-CN',
      storageState: guestStorageState,
    });
    const victimPage = await victimContext.newPage();
    const victimLogin = new LoginPage(victimPage);
    await victimLogin.login(e2eAccounts.orphanSelf.username, e2eAccounts.orphanSelf.password);
    await expect(victimPage).toHaveURL(/\/(welcome|\/?)$/);

    const onlineUserPage = new SystemOnlineUserPage(page);
    await onlineUserPage.goto();
    await expect(page.getByRole('heading', { name: '会话用户' })).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: e2eAccounts.orphanSelf.username })).toBeVisible();
    await onlineUserPage.kickAllSessionsForUsername(e2eAccounts.orphanSelf.username);
    await expect(page.getByText('已踢出该用户全部会话')).toBeVisible();

    // 被踢端须 reload：同 URL goto 不会重载 SPA，无法触发下一请求鉴权
    await victimPage.reload();
    await expect(victimPage).toHaveURL(/\/login/);
    await expect(victimPage.getByRole('button', { name: '登录' })).toBeVisible();

    await victimContext.close();
  });
});
