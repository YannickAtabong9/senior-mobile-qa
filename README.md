# Senior Mobile QA Engineering

[![Android Mobile Tests](https://github.com/YannickAtabong9/senior-mobile-qa/actions/workflows/android-mobile-tests.yml/badge.svg)](https://github.com/YannickAtabong9/senior-mobile-qa/actions/workflows/android-mobile-tests.yml)

A portfolio-grade Mobile QA Engineering project demonstrating functional automation, test architecture, CI/CD, security assessment, reliability testing, and performance observation against the Sauce Labs My Demo App React Native Android application.

The project uses a physical Android device for local validation and an Android emulator for automated regression testing in GitHub Actions.

---

## Tech Stack

- Appium 3
- WebdriverIO
- TypeScript
- Mocha
- UiAutomator2
- ADB
- MobSF
- GitHub Actions
- Android Emulator
- Physical Android Device

---

## Application Under Test

- **Application:** Sauce Labs My Demo App
- **Platform:** Android
- **Package:** `com.saucelabs.mydemoapp.rn`
- **Version:** `1.3.0`
- **Build:** `244`

---

## Functional Test Coverage

The automated regression suite contains 8 spec files covering critical e-commerce functionality.

### Product & Cart

- Add a product to the cart
- Validate product price and cart total
- Increase and decrease product quantity
- Validate recalculated totals
- Remove a product from the cart
- Dynamically select a different catalogue product

### Authentication

- Successful login with valid credentials
- Invalid credential validation and error handling

### Checkout

- Complete authenticated purchase journey
- Shipping information entry
- Payment information entry
- Order review and total validation
- Successful order completion
- Required shipping-field validation

---

## Test Results

### Physical Device

Local regression testing was executed on a physical Android device.

- **Android:** 14
- **API Level:** 34
- **Tests:** 8/8 passed
- **Pass Rate:** 100%
- **Suite Runtime:** approximately 5 minutes

### GitHub Actions

The same regression suite runs automatically against an Android emulator in GitHub Actions.

- **Android API:** 33
- **Environment:** Android Emulator
- **Spec Files:** 8/8 passed
- **Pass Rate:** 100%
- **CI Test Runtime:** approximately 2 minutes

---

## Automation Architecture

The framework uses the Screen Object pattern to separate test scenarios from UI interaction logic.

```text
src/screens/
├── CartScreen.ts
├── CatalogScreen.ts
├── CheckoutScreen.ts
├── LoginScreen.ts
└── ProductDetailsScreen.ts
```

Test specifications are organized independently:

```text
tests/
├── cart-quantity.spec.ts
├── cart-remove.spec.ts
├── cart.spec.ts
├── checkout-e2e.spec.ts
├── checkout-validation.spec.ts
├── login-invalid.spec.ts
├── login.spec.ts
└── product-selection.spec.ts
```

This architecture reduces selector duplication and makes UI interaction logic reusable across test scenarios.

---

## Test Isolation & Stability

The framework is designed to minimize state leakage and test-order dependency.

Key practices include:

- Controlled application state between independent scenarios
- Sequential execution on a single mobile device
- Explicit waits for asynchronous UI behavior
- Independent authentication and cart scenarios
- State validation before state-dependent interactions

During checkout automation, a billing-address checkbox was already selected by default. Blindly interacting with the control changed the expected state and caused the checkout flow to fail.

Failure diagnostics exposed the actual UI state, allowing the automation to be corrected rather than masking the failure with retries or fixed delays.

---

## Failure Diagnostics

When a test fails, the framework automatically captures:

- Screenshot of the failed application state
- Android UI page source

This provides diagnostic evidence beyond console logs and makes failed states easier to investigate.

Failure artifacts are also configured for upload from unsuccessful GitHub Actions runs.

---

## Continuous Integration

GitHub Actions provides automated Android regression testing.

The workflow runs on:

- Pushes to `main`
- Pull requests targeting `main`

The CI pipeline:

1. Checks out the repository
2. Configures Node.js
3. Installs project dependencies
4. Installs Appium and UiAutomator2
5. Starts an Android API 33 emulator
6. Downloads and installs the application APK
7. Starts the Appium server
8. Executes the WebdriverIO regression suite
9. Uploads diagnostic artifacts when failures occur

The current CI regression run completes all 8 spec files successfully.

---

## Security Assessment

The Android APK was assessed using MobSF static analysis followed by targeted runtime validation using Android tooling.

Assessment areas included:

- APK static analysis
- Application signing
- Manifest configuration
- Exported components
- Android permissions
- Runtime debuggability
- Sensitive logging
- External storage behavior
- Static finding triage

Scanner findings were treated as investigation leads rather than automatically classified as confirmed vulnerabilities.

Key observations included:

- APK signed with a debug certificate
- Application not debuggable at runtime
- No sensitive login, payment, or shipping data observed in the tested logcat flow
- Requested dangerous permissions were not granted on the Android 14 test device
- No exported application components identified by MobSF
- Suspected hardcoded secret identified as a WebSocket GUID false positive
- Legacy Android support identified as a security consideration

---

## Reliability & Performance

Runtime reliability and basic performance characteristics were assessed using ADB and Android system tooling.

### Cold Launch

10 repeated cold launches were measured.

| Metric | Result |
|---|---:|
| Successful Launches | 10/10 |
| Failure Rate | 0% |
| Average | ~2.03 s |
| Median | ~1.99 s |
| Minimum | 1.97 s |
| Maximum | 2.29 s |

No arbitrary performance threshold was applied. The results represent measurements from the tested physical device and environment.

### Crash & ANR Observation

The application was exercised through normal user journeys while Android logs were inspected for:

- Fatal exceptions
- AndroidRuntime crashes
- ANRs
- Process death

No crash or ANR evidence was observed during the tested session.

### Memory Observation

Memory usage was measured before and after repeated navigation.

| Stage | Total PSS |
|---|---:|
| Baseline | ~63.6 MB |
| After 10 navigation cycles | ~95.0 MB |
| After ~2 minutes idle | ~79.1 MB |

Memory increased during repeated navigation and partially recovered while the application remained idle.

This is recorded as an observation rather than a confirmed memory leak. Longer-duration testing and dedicated heap profiling would be required to establish whether retained memory represents a leak.

---

## Running the Tests Locally

### Prerequisites

Ensure the following are available:

- Node.js
- Appium
- UiAutomator2 driver
- Android SDK / ADB
- Connected Android device
- My Demo App installed on the device

Install project dependencies:

```bash
npm install
```

Start Appium:

```bash
appium --address 0.0.0.0 --port 4723
```

Run the Android regression suite:

```bash
npm run test:android
```

The local configuration defaults to the physical test device, while the device UDID can be overridden using the `ANDROID_UDID` environment variable for CI execution.

---

## Project Scope

This project currently demonstrates:

- Android functional automation
- End-to-end mobile testing
- Physical-device testing
- Emulator-based CI testing
- GitHub Actions integration
- Test isolation
- Failure diagnostics
- Mobile security assessment
- Crash and ANR observation
- Cold-start measurement
- Runtime memory observation

### Current Limitations

- Android only
- Local validation performed on one physical device
- No iOS coverage
- Backend API testing is outside the current scope
- Security assessment is not presented as a full penetration test
- Memory analysis is observational rather than heap-level profiling
- Performance measurements apply to the tested device and environment

---

## Author

**Yannick Atabong**

Senior Quality & Security Assurance Engineer
