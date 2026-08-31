import { LoginScreen } from '../src/screens/LoginScreen';

describe('Authentication', () => {
  let loginScreen: LoginScreen;

  before(() => {
    loginScreen = new LoginScreen(browser);
  });

  it('should login successfully with valid credentials', async () => {
    await loginScreen.navigateToLogin();

    await loginScreen.login(
      'bob@example.com',
      '10203040'
    );

    const productsScreen = await browser.$('~products screen');

    await productsScreen.waitForDisplayed({
      timeout: 10000,
    });

    expect(await productsScreen.isDisplayed()).toBe(true);

    // Verify authenticated state
    await loginScreen.openMenuButton.click();

    await loginScreen.logoutMenuItem.waitForDisplayed({
      timeout: 10000,
    });

    expect(await loginScreen.logoutMenuItem.isDisplayed())
      .toBe(true);
  });
});
