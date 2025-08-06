import { type Page, type Locator } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly cartItems: Locator;
    readonly checkoutButton: Locator;
    readonly shoppingCartLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('[data-test="checkout"]');
        this.shoppingCartLink = page.locator('.shopping_cart_link');
    }

    async goto() {
      await this.shoppingCartLink.click();
    }

    async removeProduct(productName: string) {
        const productLocator = this.cartItems.filter({ hasText: productName });
        await productLocator.locator('button:has-text("REMOVE")').click();
    }
}