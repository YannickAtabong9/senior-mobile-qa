import { CatalogScreen } from '../src/screens/CatalogScreen';
import { ProductDetailsScreen } from '../src/screens/ProductDetailsScreen';
import { CartScreen } from '../src/screens/CartScreen';

describe('Shopping Cart', () => {
  let catalogScreen: CatalogScreen;
  let productDetailsScreen: ProductDetailsScreen;
  let cartScreen: CartScreen;

  before(() => {
    catalogScreen = new CatalogScreen(browser);
    productDetailsScreen = new ProductDetailsScreen(browser);
    cartScreen = new CartScreen(browser);
  });

  it('should add Sauce Labs Backpack to the cart with the correct price and total', async () => {
    await catalogScreen.waitForCatalogue();

    await catalogScreen.openProduct('Sauce Labs Backpack');
    await productDetailsScreen.waitForProductDetails();

    await productDetailsScreen.addToCart();
    await productDetailsScreen.openCart();

    await cartScreen.waitForCart();

    const productName = await cartScreen.getProductName();
    const productPrice = await cartScreen.getProductPrice();
    const totalNumber = await cartScreen.getTotalNumber();
    const totalPrice = await cartScreen.getTotalPrice();

    expect(productName).toEqual('Sauce Labs Backpack');
    expect(productPrice).toEqual('$29.99');
    expect(totalNumber).toEqual('1 item');
    expect(totalPrice).toEqual('$29.99');
  });
});
