import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutPages } from '../src/pages/CheckoutPages';
import { parsePrice } from '../src/utils/helpers';

test.describe('SauceDemo E2E Tests', () => {
  const standard_user = process.env.STANDARD_USER!;
  const problem_user = process.env.PROBLEM_USER!;
  const password = process.env.PASSWORD!;

  test('TC-001: Add three least expensive products, remove second-least, checkout and verify', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPages = new CheckoutPages(page);
    await loginPage.goto();
    await loginPage.login(standard_user, password);
    const allProducts = await inventoryPage.getAllProducts();
    const sortedProducts = allProducts.sort((a, b) => a.price - b.price);
    const leastExpensiveThree = sortedProducts.slice(0, 3);
    const [productA, productB, productC] = leastExpensiveThree;
    for (const product of leastExpensiveThree) {
      await inventoryPage.addProductToCart(product.name);
    }
    await cartPage.goto();
    await cartPage.removeProduct(productB.name);
    await cartPage.checkoutButton.click();
    await checkoutPages.fillInformation('Ruturaj', 'Darekar', '12345');
    const expectedSubtotal = parseFloat((productA.price + productC.price).toFixed(2));
    const subtotalText = await checkoutPages.subtotalLabel.innerText();
    expect(parsePrice(subtotalText)).toBe(expectedSubtotal);
    await checkoutPages.finishCheckout();
    await expect(checkoutPages.confirmationHeader).toHaveText('Thank you for your order!');
  });
  
  test('TC-002: Navigate to third highest-priced product and verify consistency (standard_user)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(standard_user, password);
    await inventoryPage.getAllProducts(); 
    await inventoryPage.sortProductsBy('hilo');
    const allProductsSorted = await inventoryPage.getAllProducts();
    const thirdHighestProduct = allProductsSorted[2];
    await inventoryPage.openProductDetails(thirdHighestProduct.name);
    const detailName = await page.locator('.inventory_details_name').innerText();
    const detailPriceString = await page.locator('.inventory_details_price').innerText();
    expect(detailName).toBe(thirdHighestProduct.name);
    expect(parsePrice(detailPriceString)).toBe(thirdHighestProduct.price);
  });

  test('TC-003: Navigate to third highest-priced product and verify name & price consistency (problem_user)', async ({ page }) => {
    test.fail(); 
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login(problem_user, password);
    await inventoryPage.getAllProducts(); 
    await inventoryPage.sortProductsBy('hilo');
    const allProductsSorted = await inventoryPage.getAllProducts();
    const thirdHighestProduct = allProductsSorted[2];
    await inventoryPage.openProductDetails(thirdHighestProduct.name);
    const detailName = await page.locator('.inventory_details_name').innerText();
    
    expect(detailName).toBe(thirdHighestProduct.name);
  });
});