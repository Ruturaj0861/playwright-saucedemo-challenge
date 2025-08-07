import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/LoginPage";
import { InventoryPage } from "../src/pages/InventoryPage";
import { confirmationMessages } from "../src/data/testData";

const standard_user = process.env.STANDARD_USER!;
const problem_user = process.env.PROBLEM_USER!;
const password = process.env.PASSWORD!;

test.describe("SauceDemo E2E Tests", () => {
  test.describe("Standard User", () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      inventoryPage = await loginPage.loginAs(standard_user, password);
    });

    test("TC-001: Full checkout flow with least expensive items", async () => {
      const leastExpensiveProducts =
        await inventoryPage.getLeastExpensiveProducts(3);
      await inventoryPage.addProductsToCart(leastExpensiveProducts);
      expect(await inventoryPage.getCartCount()).toBe(3);

      const cartPage = await inventoryPage.navigateToCart();

      const productsInCart = await cartPage.getProductsInCart();
      // Use toEqual to compare the content of two arrays of objects
      expect(productsInCart).toEqual(leastExpensiveProducts);

      const productToRemove = leastExpensiveProducts[1];
      await cartPage.removeProduct(productToRemove.name);

      const remainingProductsInCart = await cartPage.getProductsInCart();
      const expectedRemainingProducts = leastExpensiveProducts.filter(
        (p) => p.name !== productToRemove.name
      );
      expect(remainingProductsInCart).toEqual(expectedRemainingProducts);

      const checkoutPage = await cartPage.navigateToCheckout();
      await checkoutPage.fillInformationAndContinue();

      const expectedSubtotal = expectedRemainingProducts.reduce(
        (sum, p) => sum + p.price,
        0
      );
      const actualSubtotal = await checkoutPage.getOrderSubtotal();
      expect(actualSubtotal).toBe(expectedSubtotal);

      await checkoutPage.finishCheckout();
      const confirmationText = await checkoutPage.getConfirmationText();
      expect(confirmationText).toBe(confirmationMessages.orderComplete);
    });

    test("TC-002: Verify product details consistency", async () => {
      const products = await inventoryPage.getProducts("hilo");
      const thirdHighestProduct = products[2];

      await inventoryPage.openProductDetails(thirdHighestProduct);
      const productDetailsOnPage =
        await inventoryPage.getProductDetailsFromPage();

      expect(productDetailsOnPage).toEqual(thirdHighestProduct);
    });
  });

  test.describe("Problem User", () => {
    test("TC-003: Verify product details consistency for problem_user", async ({
      page,
    }) => {
      test.fail();

      const loginPage = new LoginPage(page);
      await loginPage.goto();
      const inventoryPage = await loginPage.loginAs(problem_user, password);

      const products = await inventoryPage.getProducts("hilo");
      const thirdHighestProduct = products[2];

      await inventoryPage.openProductDetails(thirdHighestProduct);
      const productDetailsOnPage =
        await inventoryPage.getProductDetailsFromPage();

      expect(productDetailsOnPage).toEqual(thirdHighestProduct);
    });
  });
});
