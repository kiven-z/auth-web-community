import type { Page } from '@playwright/test';

import { e2eAccounts } from '../constants/accounts';
import { e2ePaths } from '../constants/paths';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(e2ePaths.login);
    await this.page.getByRole('button', { name: '登录' }).waitFor({ state: 'visible' });
  }

  async login(
    username: string = e2eAccounts.administrator.username,
    password: string = e2eAccounts.administrator.password
  ): Promise<void> {
    await this.goto();
    await this.page.getByPlaceholder('账号').fill(username);
    await this.page.getByPlaceholder('密码').fill(password);
    await this.page.getByRole('button', { name: '登录' }).click();
  }
}
