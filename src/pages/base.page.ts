import type { Locator, Page } from '@playwright/test';

import { TIMEOUTS } from '../utils/constants';

/**
 * Shared behavior for every page object.
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Wait for the blocking form loader to clear.
   */
  protected async waitForLoader(timeout = TIMEOUTS.DEFAULT): Promise<void> {
    const loader = this.page.locator('.oxd-form-loader');
    if (await loader.count()) {
      await loader.first().waitFor({ state: 'detached', timeout }).catch(() => {
      });
    }
  }

  /** Success/error toast. Auto-dismisses, so assert on it promptly. */
  get toast(): Locator {
    return this.page.locator('.oxd-toast');
  }

}