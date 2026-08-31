# Mobile Reliability & Performance Assessment

## 1. Overview

This document summarizes the reliability and runtime performance assessment performed against the Android build of the Sauce Labs My Demo App.

The assessment complements the functional automation and security testing in this project by evaluating application behavior under repeated launches and user interaction.

The assessment focused on:

- Cold-start reliability
- Application startup time
- Crash and ANR observation
- Runtime memory usage
- Memory behavior under repeated navigation
- Memory recovery after workload

The objective was to collect reproducible runtime evidence without introducing unsupported performance thresholds or claiming issues that were not demonstrated.

---

## 2. Application Under Test

- **Application:** Sauce Labs My Demo App
- **Platform:** Android
- **Package:** `com.saucelabs.mydemoapp.rn`
- **Version:** `1.3.0`
- **Build:** `244`

### Primary Runtime Environment

- **Device Type:** Physical Android device
- **Android Version:** 14
- **API Level:** 34
- **Screen Resolution:** 576 x 1280
- **Connection:** ADB over Wi-Fi

Performance results in this document apply specifically to the tested device, application build, and environment.

---

## 3. Tooling

Runtime assessment used Android platform tooling including:

- ADB
- `am start -W`
- `dumpsys meminfo`
- `logcat`

The tests were performed independently of the WebdriverIO functional automation suite where manual interaction provided more appropriate runtime observation.

---

## 4. Cold-Start Reliability Test

The application was force-stopped and cold-launched 10 consecutive times.

Android Activity Manager timing information was captured using:

```bash
adb shell am force-stop com.saucelabs.mydemoapp.rn

adb shell am start -W \
  -n com.saucelabs.mydemoapp.rn/.MainActivity
```

The following Android metrics were monitored:

- `Status`
- `LaunchState`
- `TotalTime`
- `WaitTime`

All 10 executions reported:

```text
Status: ok
LaunchState: COLD
```

### Results

| Launch | Total Time |
|---:|---:|
| 1 | 2294 ms |
| 2 | 1970 ms |
| 3 | 2017 ms |
| 4 | 1979 ms |
| 5 | 1998 ms |
| 6 | 2079 ms |
| 7 | 1991 ms |
| 8 | 1990 ms |
| 9 | 2009 ms |
| 10 | 1977 ms |

---

## 5. Cold-Start Summary

| Metric | Result |
|---|---:|
| Attempts | 10 |
| Successful Launches | 10 |
| Failed Launches | 0 |
| Success Rate | 100% |
| Average TotalTime | ~2030 ms |
| Median TotalTime | ~1995 ms |
| Minimum TotalTime | 1970 ms |
| Maximum TotalTime | 2294 ms |
| Approximate Standard Deviation | 93 ms |

The majority of launches clustered around approximately 2 seconds.

The first measured launch was the slowest at 2294 ms, while subsequent measurements remained relatively tightly grouped.

### Assessment

**Status: Stable across tested cold launches**

No application launch failure was observed during the 10-run sample.

No arbitrary pass/fail startup-time threshold was defined for this project. Therefore, the approximately 2.03-second average is reported as an observed measurement rather than classified as inherently good or poor performance.

---

## 6. Crash & ANR Observation

The application was manually exercised through representative user behavior including:

- Authentication
- Product browsing
- Cart interaction
- Checkout navigation
- Background and foreground transitions

Android runtime logs were then inspected for indicators including:

```text
FATAL EXCEPTION
AndroidRuntime
ANR in
am_anr
has died
Process: com.saucelabs.mydemoapp.rn
```

No matching crash or ANR evidence was observed during the exercised session.

### Assessment

**Status: PASS for tested session**

No crash or ANR was observed during the evaluated user flows.

This result represents the tested session only and does not imply that the application can never crash or become unresponsive under other conditions.

---

## 7. Runtime Memory Snapshot

Android memory information was collected using:

```bash
adb shell dumpsys meminfo com.saucelabs.mydemoapp.rn
```

A representative runtime snapshot produced approximately:

| Metric | Observation |
|---|---:|
| Total PSS | ~107.6 MB |
| Total RSS | ~139.0 MB |
| Total Swap PSS | ~39.9 MB |

This measurement was treated as a runtime observation rather than a pass/fail result.

A single memory snapshot is insufficient to establish a memory leak.

---

## 8. Repeated Navigation Memory Test

A controlled before-and-after observation was performed to evaluate memory behavior during repeated navigation.

### Baseline

Immediately before the workload:

```text
TOTAL PSS: 65128 KB
TOTAL RSS: 87720 KB
TOTAL SWAP PSS: 33055 KB
```

Baseline Total PSS:

**~63.6 MB**

### Workload

The following application flow was manually repeated approximately 10 times without force-stopping the application:

```text
Catalogue
   ↓
Open Sauce Labs Backpack
   ↓
Add to Cart
   ↓
Open Cart
   ↓
Return to Catalogue
```

### Immediately After Workload

```text
TOTAL PSS: 97288 KB
TOTAL RSS: 141724 KB
TOTAL SWAP PSS: 20534 KB
```

Total PSS after workload:

**~95.0 MB**

Observed PSS increase:

**~31.4 MB / 49.4%**

---

## 9. Idle Memory Recovery

After the repeated-navigation workload, the application was left idle for approximately two minutes.

Memory was measured again:

```text
TOTAL PSS: 80962 KB
TOTAL RSS: 84444 KB
TOTAL SWAP PSS: 56262 KB
```

Idle Total PSS:

**~79.1 MB**

### Comparison

| Stage | Total PSS | Change vs Baseline |
|---|---:|---:|
| Baseline | ~63.6 MB | — |
| After 10 cycles | ~95.0 MB | +49.4% |
| After ~2 min idle | ~79.1 MB | +24.3% |

Memory decreased by approximately:

**16.3 MB / 16.8%**

from the post-workload measurement while the application remained idle.

---

## 10. Memory Assessment

Repeated navigation produced measurable memory growth.

However, memory subsequently decreased while the application remained idle, demonstrating partial memory reclamation.

### Assessment

**Status: No confirmed memory leak**

The observed behavior does not provide sufficient evidence to classify the application as having a memory leak.

Potential explanations for retained memory include:

- Application caching
- React Native runtime behavior
- Image/resource caching
- Retained application state
- Android memory-management behavior

Confirming a memory leak would require additional analysis such as:

- Longer-duration soak testing
- Repeated workload sampling
- Heap dumps
- Allocation profiling
- Object-retention analysis
- Android Studio Memory Profiler analysis

The result is therefore documented as an observation rather than a defect.

---

## 11. Reliability Summary

| Area | Result |
|---|---|
| Cold Launches | 10/10 successful |
| Cold-Launch Failure Rate | 0% |
| Average Cold Start | ~2.03 seconds |
| Crash Observation | No crash observed |
| ANR Observation | No ANR observed |
| Memory Under Repeated Navigation | Increased |
| Memory After Idle Period | Partially recovered |
| Confirmed Memory Leak | No |

---

## 12. Testing Principles Demonstrated

This assessment demonstrates several reliability and performance testing principles:

### Measure Before Classifying

Performance values were recorded without inventing arbitrary acceptance thresholds.

### Repeat Measurements

Cold-start performance was measured across multiple executions rather than using a single launch.

### Separate Observation from Defect

Memory growth was not automatically classified as a leak.

### Observe Recovery Behavior

Memory was measured again after an idle period to determine whether some allocations were reclaimed.

### Use Runtime Evidence

Android system tooling was used to obtain application-level runtime evidence rather than relying only on visual behavior.

### Scope Conclusions

Crash, ANR, memory, and startup conclusions are limited to the tested environment and workload.

---

## 13. Limitations

The reliability and performance assessment has several limitations:

- Testing was performed primarily on one physical Android device.
- Startup measurements are device-specific.
- No formal product startup-time SLA was available.
- Memory testing was observational.
- Heap-level profiling was not performed.
- Long-duration soak testing was not performed.
- CPU utilization was not formally benchmarked.
- Battery consumption was not formally benchmarked.
- Network performance was outside the assessment scope.
- Results should not be generalized to all Android devices.

---

## 14. Conclusion

The tested Android build demonstrated consistent cold-start reliability across 10 consecutive launches, with an average measured startup time of approximately 2.03 seconds.

No crash or ANR evidence was observed during the representative runtime session.

Repeated navigation increased application memory usage from approximately 63.6 MB PSS to 95.0 MB PSS. After approximately two minutes of idle time, PSS decreased to approximately 79.1 MB, demonstrating partial memory reclamation.

The memory behavior was therefore documented as an observation rather than classified as a confirmed memory leak.

Overall, the assessment demonstrates an evidence-driven approach to mobile reliability and performance testing that separates measured behavior from unsupported conclusions.
