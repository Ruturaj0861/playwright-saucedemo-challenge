import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { checkoutInfo } from "../data/testData";
import { parsePrice } from "../utils/helpers";

export class CheckoutPages extends BasePage {
  private readonly firstNameInput = this.page.locator(
    '[data-test="firstName"]'
  );
  private readonly lastNameInput = this.page.locator('[data-test="lastName"]');
  private readonly postalCodeInput = this.page.locator(
    '[data-test="postalCode"]'
  );
  private readonly continueButton = this.page.locator('[data-test="continue"]');
  private readonly finishButton = this.page.locator('[data-test="finish"]');
  private readonly subtotalLabel = this.page.locator(".summary_subtotal_label");
  private readonly taxLabel = this.page.locator(".summary_tax_label");
  private readonly totalLabel = this.page.locator(".summary_total_label");
  private readonly confirmationHeader = this.page.locator(".complete-header");

  constructor(page: Page) {
    super(page);
  }

  async fillInformationAndContinue() {
    await this.enterValue(this.firstNameInput, checkoutInfo.firstName);
    await this.enterValue(this.lastNameInput, checkoutInfo.lastName);
    await this.enterValue(this.postalCodeInput, checkoutInfo.postalCode);
    await this.clickElement(this.continueButton);
  }

  async getOrderSubtotal(): Promise<number> {
    const subtotalText = await this.getElementText(this.subtotalLabel);
    return parsePrice(subtotalText);
  }

  async getConfirmationText(): Promise<string> {
    return this.getElementText(this.confirmationHeader);
  }

  async finishCheckout() {
    await this.clickElement(this.finishButton);
  }
}


