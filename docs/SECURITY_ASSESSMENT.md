# Mobile Security Assessment

## 1. Overview

This document summarizes the security assessment performed against the Android build of the Sauce Labs My Demo App used in this Mobile QA Engineering project.

The assessment combines:

- Static APK analysis using MobSF
- Android package inspection
- Permission validation
- Runtime debuggability validation
- Runtime log inspection
- External storage inspection
- Manual triage of static-analysis findings

The objective was not to perform a full penetration test. The goal was to incorporate security assurance into the broader mobile quality engineering process and distinguish scanner observations from security issues that could be validated at runtime.

---

## 2. Application Under Test

- **Application:** Sauce Labs My Demo App
- **Platform:** Android
- **Package:** `com.saucelabs.mydemoapp.rn`
- **Version:** `1.3.0`
- **Build:** `244`
- **APK Size:** approximately 31.8 MB
- **Primary Runtime Device:** Android 14 / API 34 physical device

---

## 3. Assessment Tooling

The following tools were used:

- MobSF
- ADB
- Android `dumpsys`
- Android `logcat`
- Android package manager inspection
- Android filesystem inspection

MobSF was executed locally using Docker.

Static-analysis findings were treated as investigation leads rather than automatically classified as confirmed vulnerabilities.

---

## 4. Static Analysis Summary

MobSF reported a security score of:

**55 / 100**

The scan identified several areas requiring review, including:

- Debug signing certificate
- Legacy Android version support
- Potential sensitive logging
- Potential hardcoded information
- External storage usage
- Weak cryptographic primitives in analyzed code
- Insecure random number generation indicators
- Raw SQLite usage
- Temporary file usage

The scan also identified positive security characteristics, including:

- No exported activities among the analyzed activities
- No exported services among the analyzed services
- No exported receivers among the analyzed receivers
- No exported providers among the analyzed providers
- SSL certificate pinning indicators
- Possible root-detection functionality

Static findings were manually triaged because results may originate from application code, framework code, or bundled third-party dependencies.

---

## 5. Finding Triage

| Finding | Static Result | Runtime / Manual Validation | Assessment |
|---|---|---|---|
| Debug signing certificate | Detected | Certificate identified as Android Debug | Confirmed build-security observation |
| Runtime debuggable application | Required validation | `run-as` rejected access because package was not debuggable | Not enabled at runtime |
| Exported components | None detected | MobSF reported no exported analyzed components | Positive security observation |
| Sensitive logging | Potential logging identified | Tested login, cart and checkout flows using logcat | Not confirmed in tested flow |
| Dangerous permissions | Permissions requested | Relevant dangerous permissions were not granted on test device | Requested but not currently granted |
| External storage | Potential usage identified | No application files observed in tested external app-data path | Exposure not confirmed |
| Hardcoded sensitive information | Potential value detected | Value identified as standard WebSocket GUID | False positive |
| Legacy Android support | Minimum SDK 21 | Static configuration confirmed | Security consideration |
| Weak crypto / RNG / SQLite findings | Static indicators | Not traced to exploitable application behavior | Unconfirmed static observations |

---

## 6. Application Signing

MobSF identified that the APK was signed using an Android debug certificate.

The certificate subject indicated:

```text
Android Debug
```

The APK was reported as signed using:

- APK Signature Scheme v1
- APK Signature Scheme v2

The static report also raised warnings relating to SHA-1 and older Android signing behavior.

### Assessment

**Status: Confirmed build-security observation**

A debug certificate should not be used to sign a production release.

However, the application assessed in this project is a public demo/testing application. The finding is therefore documented as a build-security observation rather than presented as evidence of compromise of a production application.

---

## 7. Runtime Debuggability

Runtime debuggability was validated using ADB.

The following type of check was performed:

```bash
adb shell run-as com.saucelabs.mydemoapp.rn
```

Android returned:

```text
run-as: package not debuggable
```

Package flags were also inspected and did not expose a `DEBUGGABLE` flag.

### Assessment

**Status: PASS**

The tested application package was not debuggable at runtime.

This demonstrates why signing configuration and runtime debuggability should be assessed independently.

---

## 8. Exported Components

MobSF analyzed the application's Android components and reported no exported components among the counted:

- Activities
- Services
- Broadcast receivers
- Content providers

### Assessment

**Status: Positive security observation**

No exported application components were identified by the static analysis, reducing unnecessary Android inter-process attack surface.

This result is limited to the components analyzed by the scanner and is not presented as proof that the application has no possible IPC attack surface.

---

## 9. Android Permissions

The manifest requested permissions including:

- Fine location
- Coarse location
- Camera
- Phone state
- External storage
- Media access
- Notifications

Runtime package inspection was then used to determine whether relevant dangerous permissions were actually granted.

The tested Android 14 device showed the relevant dangerous permissions as:

```text
granted=false
```

This included permissions relating to:

- Location
- Camera
- Phone state
- External storage
- Media
- Notifications

### Assessment

**Status: Requested but not granted**

Manifest permission declarations alone do not demonstrate that the application currently possesses access to the protected resource.

Runtime permission state was therefore considered when assessing exposure.

---

## 10. Sensitive Logging Validation

MobSF identified application logging behavior during static analysis.

To determine whether sensitive user information was exposed during normal runtime behavior, Android logcat was cleared and the application was manually exercised through flows involving:

- Authentication
- Product browsing
- Cart interaction
- Checkout
- Shipping information
- Payment information

The resulting logs were searched for representative sensitive values and keywords including:

- Demo email address
- Demo password
- Payment card number
- CVV / security code
- Shipping information
- Password
- Token
- Authorization data

No tested authentication credentials, payment information, or shipping data were observed in logcat.

A TestFairy SDK diagnostic message was observed indicating an SDK App Token configuration issue, but the message did not expose the tested user credentials or payment information.

### Assessment

**Status: PASS for tested flows**

The static logging observation was not confirmed as sensitive-data exposure during the tested login and checkout flows.

This does not prove that sensitive logging can never occur through other application paths.

---

## 11. External Storage Validation

Static analysis identified external-storage-related behavior.

Runtime package inspection also showed legacy external-storage compatibility configuration.

The application's external app-data path was inspected using ADB after exercising the tested flows.

No files were observed under the inspected application-specific external storage path during the tested login and checkout journey.

Relevant storage permissions were also not granted on the Android 14 test device.

### Assessment

**Status: Exposure not confirmed**

The application contains storage-related capabilities and legacy compatibility behavior, but no sensitive external-storage exposure was demonstrated during the tested runtime flow.

---

## 12. Hardcoded Information Triage

MobSF reported a possible hardcoded sensitive value:

```text
258EAFA5-E914-47DA-95CA-C5AB0DC85B11
```

Manual review identified this value as the standard WebSocket protocol GUID used during the WebSocket handshake process.

It is not an application credential, API secret, authentication token, or private key.

### Assessment

**Status: False positive**

This demonstrates why static-analysis findings require contextual review before being reported as vulnerabilities.

---

## 13. Legacy Android Support

Manifest analysis identified a minimum supported Android SDK level of:

```text
minSdkVersion = 21
```

Android API 21 corresponds to Android 5.0.

Supporting older Android versions can increase security exposure because older platform versions lack security improvements introduced in later Android releases.

### Assessment

**Status: Security consideration**

The actual business risk depends on the application's supported-device policy and whether production users are permitted to run the application on legacy Android versions.

The finding is therefore documented as a configuration risk rather than an exploitable vulnerability.

---

## 14. Additional Static Findings

MobSF also identified indicators involving:

- MD5
- Insecure random number generation
- Raw SQLite queries
- Temporary files
- Logging
- External storage

These findings were not automatically classified as application vulnerabilities.

The analyzed APK contains React Native framework code and third-party dependencies, meaning a static code pattern does not by itself demonstrate that the application uses that functionality in a security-sensitive or exploitable manner.

### Assessment

**Status: Unconfirmed static observations**

Further source tracing or targeted runtime testing would be required before classifying these findings as vulnerabilities.

---

## 15. Positive Security Observations

The assessment also produced several positive observations:

- Application was not debuggable at runtime
- No exported analyzed application components were identified
- Relevant dangerous permissions were not granted on the tested device
- No tested credentials or payment data were observed in logcat
- No application files were observed in the inspected external storage location during the tested flow
- Static analysis identified SSL certificate pinning indicators
- Static analysis identified possible root-detection functionality

Positive observations are scoped specifically to the build, device, and flows assessed.

---

## 16. Assessment Summary

| Area | Result |
|---|---|
| APK Static Analysis | Completed |
| Signing Review | Debug certificate identified |
| Runtime Debuggability | Not enabled |
| Exported Components | None identified by static scan |
| Dangerous Permission State | Relevant permissions not granted |
| Sensitive Runtime Logging | Not observed in tested flows |
| External Storage Exposure | Not demonstrated |
| Hardcoded Secret Finding | False positive |
| Legacy Android Support | Security consideration |
| Additional Static Findings | Require further validation |

---

## 17. Key QA/Security Engineering Takeaway

The most important outcome of this assessment is not the number of scanner findings.

The assessment demonstrates a validation-driven security assurance process:

**Static Detection → Triage → Runtime Validation → Evidence → Classification**

A scanner finding is not automatically a vulnerability.

Potential issues were reviewed against runtime application behavior before conclusions were made, reducing false positives and avoiding unsupported security claims.

---

## 18. Limitations

This assessment has several intentional limitations:

- It is not a full mobile penetration test.
- Dynamic proxy-based traffic interception was outside the project scope.
- Backend API security testing was outside the project scope.
- Source-code-level tracing was not performed for every MobSF finding.
- Testing focused on one Android APK build.
- Runtime validation was performed primarily on one physical Android 14 device.
- Only selected application journeys were evaluated for sensitive logging and storage behavior.

The conclusions in this document therefore apply only to the tested build, environment, and test coverage.

---

## 19. Conclusion

The security assessment identified a confirmed debug-signing observation and legacy-platform considerations while demonstrating that several potentially concerning static-analysis results could not be confirmed as runtime vulnerabilities.

Runtime validation showed that the tested package was not debuggable, relevant dangerous permissions were not granted, sensitive user and payment information was not observed in the tested logs, and the suspected hardcoded secret was a false positive.

The results demonstrate the integration of security assurance into a broader Mobile QA Engineering workflow while maintaining evidence-based distinction between scanner findings, confirmed observations, false positives, and unverified risks.
