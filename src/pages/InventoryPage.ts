import { type Page, type Locator, expect } from '@playwright/test';
import { parsePrice } from '../utils/helpers';

export interface Product { name: string; price: number; }

export class InventoryPage {
  readonly page: Page;
  readonly productSortContainer: Locator;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productSortContainer = page.locator('//select[@data-test="product-sort-container"]');
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async sortProductsBy(order: 'lohi' | 'hilo') {
    await this.productSortContainer.selectOption(order);
  }
  
  async verifySortContainerDoesNotExist() {
    await expect(this.productSortContainer).not.toBeVisible();
  }

  async getAllProducts(): Promise<Product[]> {
    await this.inventoryItems.first().waitFor();
    const products: Product[] = [];
    const items = await this.inventoryItems.all();
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').innerText();
      const priceString = await item.locator('.inventory_item_price').innerText();
      products.push({ name, price: parsePrice(priceString) });
    }
    return products;
  }

  async addProductToCart(productName: string) {
    const productLocator = this.inventoryItems.filter({ hasText: productName });
    await productLocator.locator('button:has-text("ADD TO CART")').click();
  }
  
  async openProductDetails(productName: string) {
      const productLocator = this.inventoryItems.filter({ hasText: productName });
      await productLocator.locator('.inventory_item_name').click();
  }
}