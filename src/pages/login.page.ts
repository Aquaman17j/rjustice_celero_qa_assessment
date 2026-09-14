import { expect, type Locator, type Page } from '@playwright/test';

import { MESSAGES, ROUTES } from '../utils/constants';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get usernameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Username' });
  }

  get passwordInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Password' });
  }

  get submitButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorAlert(): Locator {
    return this.page.getByRole('alert');
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.LOGIN, { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAndWaitForDashboard(username: string, password: string): Promise<void> {
    await this.login(username, password);
    await this.page.waitForURL(`**${ROUTES.DASHBOARD}`);
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.errorAlert).toContainText(MESSAGES.INVALID_CREDENTIALS);
  }

  async expectOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/login/);
  }
}
