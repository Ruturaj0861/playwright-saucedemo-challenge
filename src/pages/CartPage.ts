import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CheckoutPages } from "./CheckoutPages";
import { Product } from "./InventoryPage";
import { parsePrice } from "../utils/helpers";

export class CartPage extends BasePage {
  private readonly cartItems = this.page.locator(".cart_item");
  private readonly checkoutButton = this.page.locator('[data-test="checkout"]');

  constructor(page: Page) {
    super(page);
  }

  async removeProduct(productName: string) {
    const removeButton = this.cartItems
      .filter({ hasText: productName })
      .locator('button:has-text("REMOVE")');
    await this.clickElement(removeButton);
  }

  async getProductsInCart(): Promise<Product[]> {
    const products: Product[] = [];
    const items = await this.cartItems.all();
    for (const item of items) {
      const name = await this.getElementText(
        item.locator(".inventory_item_name")
      );
      const priceString = await this.getElementText(
        item.locator(".inventory_item_price")
      );
      products.push({ name, price: parsePrice(priceString) });
    }
    return products;
  }

  async navigateToCheckout(): Promise<CheckoutPages> {
    await this.clickElement(this.checkoutButton);
    return new CheckoutPages(this.page);
  }
}
