import { expect, type Locator, type Page } from '@playwright/test'; 
import { ROUTES, TIMEOUTS } from '../utils/constants';
import { BasePage } from './base.page';
 
export class EmployeeListPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }
 

  get employeeNameInput(): Locator {
    return this.page.getByRole('textbox', { name: 'Type for hints...' }).first();
  }
 
  get employeeIdInput(): Locator {
    return this.page.getByRole('textbox').nth(2);
  }
 
  get searchButton(): Locator {
    return this.page.getByRole('button', { name: 'Search' });
  }
 
  get resetButton(): Locator {
    return this.page.getByRole('button', { name: 'Reset' });
  }
 
  get resultRows(): Locator {
    return this.page.locator('.oxd-table-card');
  }
 
  async goto(): Promise<void> {
    await this.page.goto(ROUTES.PIM_EMPLOYEE_LIST, { waitUntil: 'domcontentloaded' });
    await this.waitForLoader();
    await expect(this.searchButton).toBeVisible();
  }
 
  /**
   * Type into the autocomplete and pick the matching suggestion.
   */
  async selectEmployeeName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    const pattern = name
      .trim()
      .split(/\s+/)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('\\s+');
    const option = this.page.locator('.oxd-autocomplete-option').filter({
      hasText: new RegExp(pattern),
    });
    await option.first().waitFor({ state: 'visible', timeout: TIMEOUTS.DEFAULT });
    await option.first().click();
  }
 
  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.employeeIdInput.fill(employeeId);
    await this.searchButton.click();
    await this.waitForLoader();
  }
 
  async search(): Promise<void> {
    await this.searchButton.click();
    await this.waitForLoader();
  }
 
  /** Clear the filters between searches. */
  async reset(): Promise<void> {
    await this.resetButton.click();
    await this.waitForLoader();
  }
 
  /**
   * Exactly one result row, and it contains every expected value.
   */
  async expectExactlyOneRowMatching(values: string[]): Promise<void> {
    await expect(this.resultRows).toHaveCount(1, { timeout: TIMEOUTS.DEFAULT });
 
    for (const value of values) {
      await expect(this.resultRows.first()).toContainText(value);
    }
  }
 
  /**
   * Delete an employee by Employee Id. Used for teardown.
   *
   * Best-effort: swallows its own failures so a cleanup problem cannot fail a
   * test that already passed. Leftovers are identifiable by the QA prefix.
   */
  async deleteByEmployeeId(employeeId: string): Promise<boolean> {
    try {
      await this.goto();
      await this.searchByEmployeeId(employeeId);
 
      // Scope to the row matching this id, and require exactly one. If the
      // search silently failed, the list shows every employee and .first()
      // would delete a record belonging to someone else.
      const rows = this.resultRows.filter({ hasText: employeeId });
      if ((await rows.count()) !== 1) return false;
      const row = rows.first();
 
      await row.getByRole('button').last().click();
      await this.page.getByRole('button', { name: 'Yes, Delete' }).click();
      await this.waitForLoader();
      return true;
    } catch {
      return false;
    }
  }
}
