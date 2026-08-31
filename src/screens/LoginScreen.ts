export class LoginScreen {
  constructor(private driver: WebdriverIO.Browser) {}

  get openMenuButton() {
    return this.driver.$('~open menu');
  }

  get loginMenuItem() {
    return this.driver.$('~menu item log in');
  }

  get logoutMenuItem() {
    return this.driver.$('~menu item log out');
  }

  get loginScreen() {
    return this.driver.$('~login screen');
  }

  get usernameInput() {
    return this.driver.$('~Username input field');
  }

  get passwordInput() {
    return this.driver.$('~Password input field');
  }

  get loginButton() {
    return this.driver.$('~Login button');
  }

  get usernameError() {
    return this.driver.$('~Username-error-message');
  }

  get passwordError() {
    return this.driver.$('~Password-error-message');
  }

  get genericError() {
    return this.driver.$(
      'android=new UiSelector().text("Provided credentials do not match any user in this service.")'
    );
  }

  async navigateToLogin() {
    await this.openMenuButton.waitForDisplayed({
      timeout: 10000,
    });

    await this.openMenuButton.click();

    await this.loginMenuItem.waitForDisplayed({
      timeout: 10000,
    });

    await this.loginMenuItem.click();

    await this.waitForLoginScreen();
  }

  async waitForLoginScreen() {
    await this.loginScreen.waitForDisplayed({
      timeout: 10000,
    });
  }

  async login(username: string, password: string) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  async getGenericError() {
    return await this.genericError.getText();
  }
}
