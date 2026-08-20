import type { Page } from '@playwright/test';

import { e2ePaths } from '../constants/paths';

export class SystemOnlineUserPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(e2ePaths.systemOnlineUser);
  }

  async kickAllSessionsForUsername(username: string): Promise<void> {
    const row = this.page.getByRole('row').filter({ hasText: username });
    await row.getByRole('button', { name: '踢出全部' }).click();
    await this.page.getByRole('button', { name: '确认' }).click();
  }
}
