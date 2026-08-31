import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ProductDetailsScreen } from '../src/screens/ProductDetailsScreen';
import { CartScreen } from '../src/screens/CartScreen';
import { LoginScreen } from '../src/screens/LoginScreen';
import { CheckoutScreen } from '../src/screens/CheckoutScreen';

describe('Checkout E2E', () => {
  let catalogScreen: CatalogScreen;
  let productDetailsScreen: ProductDetailsScreen;
  let cartScreen: CartScreen;
  let loginScreen: LoginScreen;
  let checkoutScreen: CheckoutScreen;

  before(() => {
    catalogScreen = new CatalogScreen(browser);
    productDetailsScreen = new ProductDetailsScreen(browser);
    cartScreen = new CartScreen(browser);
    loginScreen = new LoginScreen(browser);
    checkoutScreen = new CheckoutScreen(browser);
  });

  it('should complete a purchase successfully', async () => {
    // Login
    await loginScreen.navigateToLogin();

    await loginScreen.login(
      'bob@example.com',
      '10203040'
    );

    await catalogScreen.waitForCatalogue();

    // Select product
    await catalogScreen.openProduct('Sauce Labs Backpack');

    await productDetailsScreen.waitForProductDetails();
    await productDetailsScreen.addToCart();
    await productDetailsScreen.openCart();

    // Validate cart
    await cartScreen.waitForCart();

    expect(await cartScreen.getProductName())
      .toEqual('Sauce Labs Backpack');

    expect(await cartScreen.getTotalPrice())
      .toEqual('$29.99');

    // Checkout
    await cartScreen.checkoutButton.click();

    // Shipping
    await checkoutScreen.waitForAddressScreen();
    await checkoutScreen.enterShippingAddress();

    // Payment
    await checkoutScreen.waitForPaymentScreen();
    await checkoutScreen.enterPaymentDetails();

    // Review
    await checkoutScreen.waitForReviewScreen();

    expect(await checkoutScreen.getTotalNumber())
      .toEqual('1 item');

    // $29.99 product + $5.99 delivery
    expect(await checkoutScreen.getTotalPrice())
      .toEqual('$35.98');

    // Place order
    await checkoutScreen.placeOrder();

    // Final business outcome
    await checkoutScreen.waitForCheckoutComplete();

    expect(await checkoutScreen.completeScreen.isDisplayed())
      .toBe(true);

    expect(await checkoutScreen.continueShoppingButton.isDisplayed())
      .toBe(true);
  });
});
