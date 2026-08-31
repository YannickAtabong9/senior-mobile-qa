import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ProductDetailsScreen } from '../src/screens/ProductDetailsScreen';
import { CartScreen } from '../src/screens/CartScreen';

describe('Shopping Cart Quantity', () => {
  let catalogScreen: CatalogScreen;
  let productDetailsScreen: ProductDetailsScreen;
  let cartScreen: CartScreen;

  before(() => {
    catalogScreen = new CatalogScreen(browser);
    productDetailsScreen = new ProductDetailsScreen(browser);
    cartScreen = new CartScreen(browser);
  });

  it('should update quantity and total price when quantity changes', async () => {
    // Add one Backpack
    await catalogScreen.waitForCatalogue();
    await catalogScreen.openProduct('Sauce Labs Backpack');

    await productDetailsScreen.waitForProductDetails();
    await productDetailsScreen.addToCart();
    await productDetailsScreen.openCart();

    await cartScreen.waitForCart();

    // Verify initial cart state
    expect(await cartScreen.getTotalNumber()).toEqual('1 item');
    expect(await cartScreen.getTotalPrice()).toEqual('$29.99');

    // Increase quantity: 1 -> 2
    await cartScreen.increaseQuantity();

    await browser.waitUntil(
      async () => (await cartScreen.getTotalNumber()) === '2 items',
      {
        timeout: 5000,
        timeoutMsg: 'Cart quantity did not increase to 2 items'
      }
    );

    expect(await cartScreen.getTotalNumber()).toEqual('2 items');
    expect(await cartScreen.getTotalPrice()).toEqual('$59.98');

    // Decrease quantity: 2 -> 1
    await cartScreen.decreaseQuantity();

    await browser.waitUntil(
      async () => (await cartScreen.getTotalNumber()) === '1 item',
      {
        timeout: 5000,
        timeoutMsg: 'Cart quantity did not decrease to 1 item'
      }
    );

    expect(await cartScreen.getTotalNumber()).toEqual('1 item');
    expect(await cartScreen.getTotalPrice()).toEqual('$29.99');
  });
});
