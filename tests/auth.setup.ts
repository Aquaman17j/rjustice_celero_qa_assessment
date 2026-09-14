/**
 * Authentication setup.
 */

import { expect, test as setup } from '@playwright/test';

import { LoginPage } from '../src/pages/login.page';
import { ROUTES } from '../src/utils/constants';

const STORAGE_STATE = 'playwright/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  // Fail with reason rather than timeout on the login form.
  expect(
    username,
    'ADMIN_USERNAME is not set. Copy .env.example to .env and fill it in.',
  ).toBeTruthy();
  expect(
    password,
    'ADMIN_PASSWORD is not set. Copy .env.example to .env and fill it in.',
  ).toBeTruthy();

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAndWaitForDashboard(username!, password!);

  await expect(page).toHaveURL(new RegExp(ROUTES.DASHBOARD));

  await page.context().storageState({ path: STORAGE_STATE });
});
