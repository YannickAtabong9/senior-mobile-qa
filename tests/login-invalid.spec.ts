import { LoginScreen } from '../src/screens/LoginScreen';

describe('Authentication - Invalid Credentials', () => {
  let loginScreen: LoginScreen;

  before(() => {
    loginScreen = new LoginScreen(browser);
  });

  it('should reject invalid credentials and display an error', async () => {
    await loginScreen.navigateToLogin();

    await loginScreen.login(
      'wrong@example.com',
      'wrongpassword'
    );

    await loginScreen.genericError.waitForDisplayed({
      timeout: 10000,
    });

    const errorMessage = await loginScreen.getGenericError();

    expect(errorMessage).toEqual(
      'Provided credentials do not match any user in this service.'
    );

    // User should remain on the Login screen
    expect(await loginScreen.loginScreen.isDisplayed())
      .toBe(true);
  });
});
