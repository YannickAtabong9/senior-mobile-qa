import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ProductDetailsScreen } from '../src/screens/ProductDetailsScreen';
import { CartScreen } from '../src/screens/CartScreen';

describe('Shopping Cart Removal', () => {
  let catalogScreen: CatalogScreen;
  let productDetailsScreen: ProductDetailsScreen;
  let cartScreen: CartScreen;

  before(() => {
    catalogScreen = new CatalogScreen(browser);
    productDetailsScreen = new ProductDetailsScreen(browser);
    cartScreen = new CartScreen(browser);
  });

  it('should remove a product from the cart', async () => {
    await catalogScreen.waitForCatalogue();
    await catalogScreen.openProduct('Sauce Labs Backpack');

    await productDetailsScreen.waitForProductDetails();
    await productDetailsScreen.addToCart();
    await productDetailsScreen.openCart();

    await cartScreen.waitForCart();

    expect(await cartScreen.getProductName())
      .toEqual('Sauce Labs Backpack');

    await cartScreen.removeItem();

    await browser.waitUntil(
      async () => !(await cartScreen.productLabel.isDisplayed()),
      {
        timeout: 5000,
        timeoutMsg: 'Product remained visible after removal'
      }
    );

    expect(await cartScreen.productLabel.isDisplayed())
      .toBe(false);
  });
});
