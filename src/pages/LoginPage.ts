import { type Page } from "@playwright/test";
import { InventoryPage } from "./InventoryPage";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private readonly usernameInput = this.page.locator('[data-test="username"]');
  private readonly passwordInput = this.page.locator('[data-test="password"]');
  private readonly loginButton = this.page.locator(
    '[data-test="login-button"]'
  );

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto("/");
  }

  async loginAs(username: string, password?: string): Promise<InventoryPage> {
    await this.enterValue(this.usernameInput, username);
    await this.enterValue(this.passwordInput, password || "");
    await this.clickElement(this.loginButton);
    return new InventoryPage(this.page);
  }
}
