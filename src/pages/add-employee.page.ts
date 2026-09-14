import { expect, type Locator, type Page } from '@playwright/test';

import { MESSAGES, ROUTES, TIMEOUTS } from '../utils/constants';
import type { EmployeeInput } from '../utils/data';
import { BasePage } from './base.page';

export class AddEmployeePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get firstNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'First Name' });
  }

  get middleNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Middle Name' });
  }

  get lastNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Last Name' });
  }

  get employeeIdInput(): Locator {
    return this.page.getByRole('textbox').nth(4);;
  }

  get saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }
  /**
   * Instead of focusing on one error message per decided to locate it by the locator for any error that may show on the add employee form
   */
  get errorMessages(): Locator {
    return this.page.locator('.oxd-input-field-error-message');
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.PIM_ADD_EMPLOYEE, { waitUntil: 'domcontentloaded' });
    await this.waitForLoader();
    await expect(this.firstNameInput).toBeVisible();
  }

  async readEmployeeId(): Promise<string> {
    return (await this.employeeIdInput.inputValue()).trim();
  }

  async fillEmployee(employee: Partial<EmployeeInput>): Promise<void> {
    if (employee.firstName !== undefined) await this.firstNameInput.fill(employee.firstName);
    if (employee.middleName !== undefined) await this.middleNameInput.fill(employee.middleName);
    if (employee.lastName !== undefined) await this.lastNameInput.fill(employee.lastName);
    if (employee.employeeId !== undefined) {
      await this.employeeIdInput.clear();
      await this.employeeIdInput.fill(employee.employeeId);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async expectSaveSuccess(): Promise<void> {
    await expect(this.toast).toContainText(MESSAGES.SAVE_SUCCESS, {
      timeout: TIMEOUTS.TOAST,
    });
  }

  async expectRedirectedToNewEmployee(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/viewPersonalDetails\/empNumber\/\d+/);
  }

  async expectStillOnForm(): Promise<void> {
    await expect(this.page).toHaveURL(/\/pim\/addEmployee/);
  }

  async expectRequiredFieldErrors(): Promise<void> {
    await expect(this.errorMessages.first()).toBeVisible();
    await expect(this.errorMessages.first()).toHaveText(MESSAGES.REQUIRED);
  }

  async expectDuplicateEmployeeIdError(): Promise<void> {
    await expect(
      this.page.getByText(MESSAGES.DUPLICATE_EMPLOYEE_ID),
    ).toBeVisible();
  }

  employeeNumberFromUrl(): string | null {
    return this.page.url().match(/empNumber\/(\d+)/)?.[1] ?? null;
  }
}