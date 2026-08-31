export class CartScreen {
  constructor(private driver: WebdriverIO.Browser) {}

  get cartScreen() {
    return this.driver.$('~cart screen');
  }

  get productLabel() {
    return this.driver.$('~product label');
  }

  get productPrice() {
    return this.driver.$('~product price');
  }

  get decreaseQuantityButton() {
    return this.driver.$('~counter minus button');
  }

  get quantityAmount() {
    return this.driver.$('~counter amount');
  }

  get increaseQuantityButton() {
    return this.driver.$('~counter plus button');
  }

  get totalNumber() {
    return this.driver.$('~total number');
  }

  get totalPrice() {
    return this.driver.$('~total price');
  }

  get removeItemButton() {
    return this.driver.$('~remove item');
  }

  get checkoutButton() {
    return this.driver.$('~Proceed To Checkout button');
  }

  async waitForCart() {
    await this.cartScreen.waitForDisplayed({
      timeout: 10000,
    });
  }

  async getProductName() {
    return await this.productLabel.getText();
  }

  async getProductPrice() {
    return await this.productPrice.getText();
  }

  async getQuantity() {
    return await this.quantityAmount.getText();
  }

  async increaseQuantity() {
    await this.increaseQuantityButton.click();
  }

  async decreaseQuantity() {
    await this.decreaseQuantityButton.click();
  }

  async getTotalNumber() {
    return await this.totalNumber.getText();
  }

  async getTotalPrice() {
    return await this.totalPrice.getText();
  }

  async removeItem() {
    await this.removeItemButton.click();
  }
}
