export class CheckoutScreen {
  constructor(private driver: WebdriverIO.Browser) {}

  // Address screen

  get addressScreen() {
    return this.driver.$('~checkout address screen');
  }

  get fullNameInput() {
    return this.driver.$('~Full Name* input field');
  }

  get addressLine1Input() {
    return this.driver.$('~Address Line 1* input field');
  }

  get addressLine2Input() {
    return this.driver.$('~Address Line 2 input field');
  }

  get cityInput() {
    return this.driver.$('~City* input field');
  }

  get stateInput() {
    return this.driver.$('~State/Region input field');
  }

  get zipCodeInput() {
    return this.driver.$('~Zip Code* input field');
  }

  get countryInput() {
    return this.driver.$('~Country* input field');
  }

  get toPaymentButton() {
    return this.driver.$('~To Payment button');
  }

  get fullNameError() {
    return this.driver.$('~Full Name*-error-message');
  }

  get addressLine1Error() {
    return this.driver.$('~Address Line 1*-error-message');
  }

  get cityError() {
    return this.driver.$('~City*-error-message');
  }

  get zipCodeError() {
    return this.driver.$('~Zip Code*-error-message');
  }

  get countryError() {
    return this.driver.$('~Country*-error-message');
  }

  // Payment screen

  get paymentScreen() {
    return this.driver.$('~checkout payment screen');
  }

  get paymentFullNameInput() {
    return this.driver.$('~Full Name* input field');
  }

  get cardNumberInput() {
    return this.driver.$('~Card Number* input field');
  }

  get expirationDateInput() {
    return this.driver.$('~Expiration Date* input field');
  }

  get securityCodeInput() {
    return this.driver.$('~Security Code* input field');
  }

  get billingAddressCheckbox() {
    return this.driver.$(
      '~checkbox for My billing address is the same as my shipping address.'
    );
  }

  get reviewOrderButton() {
    return this.driver.$('~Review Order button');
  }

  // Review screen

  get reviewOrderScreen() {
    return this.driver.$('~checkout review order screen');
  }

  get totalNumber() {
    return this.driver.$('~total number');
  }

  get totalPrice() {
    return this.driver.$('~total price');
  }

  get placeOrderButton() {
    return this.driver.$('~Place Order button');
  }

  // Complete screen

  get completeScreen() {
    return this.driver.$('~checkout complete screen');
  }

  get continueShoppingButton() {
    return this.driver.$('~Continue Shopping button');
  }

  async waitForAddressScreen() {
    await this.addressScreen.waitForDisplayed({
      timeout: 10000,
    });
  }

  async enterShippingAddress() {
    await this.fullNameInput.setValue('Test User');
    await this.addressLine1Input.setValue('11 Test Avenue');
    await this.addressLine2Input.setValue('Suite 1');
    await this.cityInput.setValue('Truro');
    await this.stateInput.setValue('Cornwall');
    await this.zipCodeInput.setValue('89750');
    await this.countryInput.setValue('United Kingdom');

    await this.toPaymentButton.click();
  }

  async waitForPaymentScreen() {
    await this.paymentScreen.waitForDisplayed({
      timeout: 10000,
    });
  }

  async enterPaymentDetails() {
    await this.paymentFullNameInput.setValue('Test User');
    await this.cardNumberInput.setValue('4111111111111111');
    await this.expirationDateInput.setValue('12/30');
    await this.securityCodeInput.setValue('123');

    await this.reviewOrderButton.click();
  }

  async waitForReviewScreen() {
    await this.reviewOrderScreen.waitForDisplayed({
      timeout: 10000,
    });
  }

  async getTotalNumber() {
    return await this.totalNumber.getText();
  }

  async getTotalPrice() {
    return await this.totalPrice.getText();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async waitForCheckoutComplete() {
    await this.completeScreen.waitForDisplayed({
      timeout: 10000,
    });
  }
}
