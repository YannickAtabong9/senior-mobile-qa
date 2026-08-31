import { CatalogScreen } from '../src/screens/CatalogScreen';

describe('Product Catalogue', () => {
  let catalogScreen: CatalogScreen;

  before(() => {
    catalogScreen = new CatalogScreen(browser);
  });

  it('should open Sauce Labs Bike Light from the catalogue', async () => {
    await catalogScreen.waitForCatalogue();

    await catalogScreen.openProduct('Sauce Labs Bike Light');

    const productTitle = await browser.$(
      'android=new UiSelector().text("Sauce Labs Bike Light")'
    );

    await productTitle.waitForDisplayed({
      timeout: 10000,
    });

    expect(await productTitle.getText()).toEqual('Sauce Labs Bike Light');
  });
});
