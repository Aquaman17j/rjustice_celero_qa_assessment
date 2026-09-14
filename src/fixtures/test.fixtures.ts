/**
 * Custom fixtures.
 *
 * Tests import `test` and `expect` from here rather than from @playwright/test,
 * which is what makes page objects arrive as arguments and keeps the arrange
 * step out of every test body.
 */

import { test as base, expect } from '@playwright/test';

import { AddEmployeePage } from '../pages/add-employee.page';
import { EmployeeListPage } from '../pages/employee-list.page';
import { LoginPage } from '../pages/login.page';

interface Fixtures {
  loginPage: LoginPage;
  addEmployeePage: AddEmployeePage;
  employeeListPage: EmployeeListPage;
  createdEmployeeIds: string[];
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },

  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },

  createdEmployeeIds: async ({ page }, use) => {
    const ids: string[] = [];
    await use(ids);

    if (ids.length > 0) {
      const list = new EmployeeListPage(page);
      for (const id of ids) {
        await list.deleteByEmployeeId(id);
      }
    }
  },
});

export { expect };
