export class ProductDetailsScreen {
  constructor(private driver: WebdriverIO.Browser) {}

  get productTitle() {
    return this.driver.$(
      'android=new UiSelector().text("Sauce Labs Backpack")'
    );
  }

  get addToCartButton() {
    return this.driver.$('~Add To Cart button');
  }

  get cartButton() {
    return this.driver.$('~cart badge');
  }

  async waitForProductDetails() {
    await this.productTitle.waitForDisplayed({
      timeout: 10000,
    });
  }

  async addToCart() {
    await this.addToCartButton.waitForDisplayed({
      timeout: 10000,
    });

    await this.addToCartButton.click();
  }

  async openCart() {
    await this.cartButton.waitForDisplayed({
      timeout: 10000,
    });

    await this.cartButton.click();
  }
}
