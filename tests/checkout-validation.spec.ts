import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ProductDetailsScreen } from '../src/screens/ProductDetailsScreen';
import { CartScreen } from '../src/screens/CartScreen';
import { LoginScreen } from '../src/screens/LoginScreen';
import { CheckoutScreen } from '../src/screens/CheckoutScreen';

describe('Checkout Validation', () => {
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

  it('should show validation errors when required shipping fields are empty', async () => {
    await loginScreen.navigateToLogin();
    await loginScreen.login('bob@example.com', '10203040');

    await catalogScreen.waitForCatalogue();

    await catalogScreen.openProduct('Sauce Labs Backpack');
    await productDetailsScreen.waitForProductDetails();
    await productDetailsScreen.addToCart();
    await productDetailsScreen.openCart();

    await cartScreen.waitForCart();

    await cartScreen.checkoutButton.click();
    await checkoutScreen.waitForAddressScreen();

    await checkoutScreen.toPaymentButton.click();

    await checkoutScreen.fullNameError.waitForDisplayed({
      timeout: 10000,
    });

    expect(await checkoutScreen.fullNameError.isDisplayed()).toBe(true);
    expect(await checkoutScreen.addressLine1Error.isDisplayed()).toBe(true);
    expect(await checkoutScreen.cityError.isDisplayed()).toBe(true);
    expect(await checkoutScreen.zipCodeError.isDisplayed()).toBe(true);
    expect(await checkoutScreen.countryError.isDisplayed()).toBe(true);

    expect(await checkoutScreen.addressScreen.isDisplayed()).toBe(true);
  });
});
