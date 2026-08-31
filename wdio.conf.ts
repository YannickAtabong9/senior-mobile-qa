export const config: WebdriverIO.Config = {
  runner: 'local',

  specs: [
    './tests/**/*.spec.ts'
  ],

  maxInstances: 1,

  hostname: '127.0.0.1',
  port: 4723,
  path: '/',

  capabilities: [{
    maxInstances: 1,

    platformName: 'Android',

    'appium:automationName': 'UiAutomator2',

    // Physical device locally, emulator in GitHub Actions
    'appium:udid':
      process.env.ANDROID_UDID || '192.168.1.76:5555',

    'appium:appPackage': 'com.saucelabs.mydemoapp.rn',
    'appium:appActivity': '.MainActivity',

    'appium:noReset': false,
    'appium:fullReset': false,

    'appium:newCommandTimeout': 120
  }],

  logLevel: 'error',

  bail: 0,

  waitforTimeout: 10000,

  connectionRetryTimeout: 120000,

  connectionRetryCount: 1,

  framework: 'mocha',

  reporters: ['spec'],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000
  },

  afterTest: async function(test, context, { passed }) {
    if (!passed) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, '-');

      const safeTestName = test.title
        .replace(/[^a-zA-Z0-9-_]/g, '_');

      const screenshotPath =
        `./artifacts/screenshots/${safeTestName}-${timestamp}.png`;

      const sourcePath =
        `./artifacts/page-source/${safeTestName}-${timestamp}.xml`;

      try {
        await browser.saveScreenshot(screenshotPath);
        console.log(`📸 Failure screenshot: ${screenshotPath}`);
      } catch (error) {
        console.error('Failed to capture screenshot:', error);
      }

      try {
        const source = await browser.getPageSource();
        const fs = await import('node:fs/promises');

        await fs.writeFile(
          sourcePath,
          source,
          'utf-8'
        );

        console.log(`📄 Failure page source: ${sourcePath}`);
      } catch (error) {
        console.error('Failed to capture page source:', error);
      }
    }
  }
};
