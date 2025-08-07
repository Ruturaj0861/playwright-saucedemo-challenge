import { type Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { CartPage } from "./CartPage";
import { parsePrice } from "../utils/helpers";

export interface Product {
  name: string;
  price: number;
}

export class InventoryPage extends BasePage {
  private readonly productSortContainer = this.page.locator(
    '//select[@class="product_sort_container"]'
  );
  private readonly inventoryItems = this.page.locator(".inventory_item");
  private readonly cartLink = this.page.locator(".shopping_cart_link");
  private readonly cartBadge = this.page.locator(".shopping_cart_badge");

  constructor(page: Page) {
    super(page);
  }

  async getProducts(sortOrder?: "lohi" | "hilo"): Promise<Product[]> {
    if (sortOrder) {
      await this.selectOptionByValue(this.productSortContainer, sortOrder);
    }
    await this.inventoryItems.first().waitFor();
    const products: Product[] = [];
    const items = await this.inventoryItems.all();
    for (const item of items) {
      const name = await item.locator(".inventory_item_name").innerText();
      const priceString = await item
        .locator(".inventory_item_price")
        .innerText();
      products.push({ name, price: parsePrice(priceString) });
    }
    return products;
  }

  async getLeastExpensiveProducts(count: number): Promise<Product[]> {
    const allProducts = await this.getProducts();
    return allProducts.sort((a, b) => a.price - b.price).slice(0, count);
  }

  async addProductsToCart(products: Product[]) {
    for (const product of products) {
      const addButton = this.inventoryItems
        .filter({ hasText: product.name })
        .locator('button:has-text("ADD TO CART")');
      await this.clickElement(addButton);
    }
  }

  async openProductDetails(product: Product) {
    const productLink = this.inventoryItems
      .filter({ hasText: product.name })
      .locator(".inventory_item_name");
    await this.clickElement(productLink);
  }

  async getProductDetailsFromPage(): Promise<Product> {
    const name = await this.getElementText(
      this.page.locator(".inventory_details_name")
    );
    const priceString = await this.getElementText(
      this.page.locator(".inventory_details_price")
    );
    return { name, price: parsePrice(priceString) };
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.getElementText(this.cartBadge), 10);
    }
    return 0;
  }

  async navigateToCart(): Promise<CartPage> {
    await this.clickElement(this.cartLink);
    return new CartPage(this.page);
  }
}
