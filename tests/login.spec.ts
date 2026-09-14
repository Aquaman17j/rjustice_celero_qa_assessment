import { test } from '../src/fixtures/test.fixtures';
 
test.use({ storageState: { cookies: [], origins: [] } });
test.describe('Login', () => {
  test('TC-07 — rejects invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
 
    await loginPage.login('not-a-real-user', 'not-a-real-password');
 
    await loginPage.expectInvalidCredentials();
    await loginPage.expectOnLoginPage();
  });
});
 


