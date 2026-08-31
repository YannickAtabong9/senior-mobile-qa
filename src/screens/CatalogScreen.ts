export class CatalogScreen {
  constructor(private driver: WebdriverIO.Browser) {}

  private productByName(productName: string) {
    return this.driver.$(
      `android=new UiSelector().text("${productName}")`
    );
  }

  async waitForCatalogue() {
    await this.productByName('Sauce Labs Backpack').waitForDisplayed({
      timeout: 10000,
    });
  }

  async openProduct(productName: string) {
    const product = this.productByName(productName);

    await product.waitForDisplayed({
      timeout: 10000,
    });

    await product.click();
  }
}
