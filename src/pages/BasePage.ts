import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickElement(locator: Locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async enterValue(locator: Locator, text: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  async selectOptionByValue(locator: Locator, value: string) {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption({ value: value });
  }


  async getElementText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return locator.innerText();
  }
}