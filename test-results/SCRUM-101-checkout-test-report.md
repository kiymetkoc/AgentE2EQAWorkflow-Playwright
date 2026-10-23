# SCRUM-101 Checkout Test Execution Report

**Application:** https://www.saucedemo.com

**Execution date:** 2026-10-23

**Browsers:** Chromium, Firefox, WebKit

**Plan:** [SauceDemo checkout test plan](../specs/saucedemo-checkout-test-plan.md)

**Manual results:** [Exploratory test results](./SCRUM-101-manual-exploration.md)

## 1. Executive Summary

- **Planned scenarios:** 9
- **Manual scenarios executed:** 9
- **Manual results:** 5 pass, 4 fail
- **Automated tests:** 9 scenarios x 3 browser projects = 27 executions
- **Final automated results:** 15 pass, 12 fail
- **Overall status:** **FAIL** — four repeatable checkout behavior gaps violate the story/business rules.

The successful checkout, required-field validation, authentication redirect, checkout-information cancellation, and mobile layout passed. The failures were reproducible manually and consistently across the three browser engines; they are product defects rather than flaky automation.

## 2. Manual Test Results

| Test scenario | Result | Summary |
|---|---|---|
| Cart details, total, and checkout choices | FAIL | Item details and actions were present; cart total was absent. |
| Required checkout fields | PASS | Missing fields were reported in sequence and blocked progression. |
| Invalid characters and postal code rejected | FAIL | Special-character names and nonnumeric postal code were accepted. |
| Valid checkout overview and completion | PASS | Overview data and totals were correct; confirmation displayed and cart cleared. |
| Cancel checkout information | PASS | Returned to cart with the item preserved. |
| Cancel order overview | FAIL | Returned to products, not cart; item remained present. |
| Empty-cart checkout guard | FAIL | Checkout was enabled and opened the information form with no items. |
| Unauthenticated direct checkout access | PASS | Redirected to login with access-denied feedback. |
| Mobile checkout usability | PASS | At 390 x 844, information and overview pages had no horizontal overflow. |

### Evidence

- [Cart with no total](../artifacts/cart-no-total.png)
- [Invalid values accepted](../artifacts/invalid-data-accepted.png)
- [Successful order confirmation](../artifacts/checkout-confirmation.png)
- [Cart at mobile viewport](../artifacts/cart-mobile.png)

## 3. Automated Test Results

### Initial run and harness correction

The first Chromium run produced 9 setup failures because the project’s default Playwright test ID attribute (`data-testid`) did not match SauceDemo’s observed `data-test` attributes. The project config was updated to use `data-test`; these were harness failures, not product results.

### Final execution by browser

| Browser project | Passed | Failed | Failed scenarios |
|---|---:|---:|---|
| Chromium | 5 | 4 | Cart total, invalid data, empty cart, overview cancellation destination |
| Firefox | 5 | 4 | Cart total, invalid data, empty cart, overview cancellation destination |
| WebKit | 5 | 4 | Cart total, invalid data, empty cart, overview cancellation destination |
| **Total** | **15** | **12** | **4 repeatable product gaps** |

All other scenarios passed in each browser. The failing tests assert the story’s expected behavior and were intentionally not altered to make defects appear to pass.

### Healing activity

- Fixed the test harness test-ID configuration to use the observed `data-test` attribute.
- Re-ran the Chromium suite and the complete Chromium/Firefox/WebKit matrix.
- Confirmed the four remaining failures reproduce in manual testing and across all three engines.
- No product code was changed, no defect assertion was weakened, and no test was skipped or marked `fixme`.
- The configured healer agent could not start because its agent metadata requests an unavailable model (`Claude Sonnet 4.6`). Failure triage was completed directly from Playwright traces and the manual observations; no additional test-code healing was appropriate.

## 4. Defects Log

### D-01 — Cart review does not show a total

- **Severity:** Medium
- **Acceptance criterion:** AC1
- **Description:** The cart shows the selected products, quantities, descriptions, per-item prices, and navigation buttons, but no subtotal or total calculation.
- **Steps to reproduce:** Log in; add Backpack and Bolt T-Shirt; open the cart.
- **Expected:** A total price calculation of `$45.98` is visible.
- **Actual:** No total is displayed in the cart.
- **Evidence:** [Cart screenshot](../artifacts/cart-no-total.png)
- **Environment:** SauceDemo; Chromium, Firefox, WebKit; also reproduced manually.

### D-02 — Invalid checkout data advances to the order overview

- **Severity:** Medium
- **Acceptance criterion:** AC5
- **Description:** Non-empty special-character-only names and a nonnumeric postal code bypass validation.
- **Steps to reproduce:** Log in; add a product; open Checkout; enter `@@!!`, `#<>?`, and `abc-!?`; select Continue.
- **Expected:** An appropriate validation message is shown and the form does not advance.
- **Actual:** The app navigates to `checkout-step-two.html`.
- **Evidence:** [Invalid-data screenshot](../artifacts/invalid-data-accepted.png)
- **Environment:** SauceDemo; Chromium, Firefox, WebKit; also reproduced manually.

### D-03 — Empty cart can proceed to checkout

- **Severity:** Medium
- **Business rule:** Cart cannot be empty when proceeding to checkout.
- **Description:** Checkout remains enabled when no items are present.
- **Steps to reproduce:** Log in; open the cart without adding products; select Checkout.
- **Expected:** Checkout is unavailable or progression is blocked.
- **Actual:** The checkout information page opens.
- **Environment:** SauceDemo; Chromium, Firefox, WebKit; also reproduced manually.

### D-04 — Cancel from order overview returns to products instead of cart

- **Severity:** Low
- **Business rule:** Users can cancel checkout at any step and return to cart.
- **Description:** Cancel on the overview returns to the inventory page.
- **Steps to reproduce:** Add a product; enter valid checkout information; continue to overview; select Cancel.
- **Expected:** The cart page is displayed with the product preserved.
- **Actual:** The inventory page is displayed; the cart item is still preserved.
- **Environment:** SauceDemo; Chromium, Firefox, WebKit; also reproduced manually.

## 5. Test Coverage Analysis

| Requirement | Coverage | Result |
|---|---|---|
| AC1 — Cart line items, details, total, and choices | Manual + automated | Details and choices pass; total missing (D-01). |
| AC2 — Checkout fields and required validation | Manual + automated | Pass; each required-field message was observed. |
| AC3 — Overview items, payment/shipping, totals, Cancel/Finish | Manual + automated | Overview and totals pass; overview Cancel destination fails (D-04). |
| AC4 — Confirmation, Back Home, cart clearing | Manual + automated | Pass. |
| AC5 — Invalid/incomplete value validation | Manual + automated | Empty-field validation passes; invalid non-empty values fail (D-02). |
| Business rule — Authentication required | Manual + automated | Pass. |
| Business rule — Nonempty cart required | Manual + automated | Fail (D-03). |
| Business rule — Cancel returns to cart | Manual + automated | Checkout-info Cancel passes; overview Cancel fails (D-04). |
| Technical note — Mobile checkout | Manual + automated | Pass at 390 x 844; no horizontal overflow observed. |

## 6. Summary and Recommendations

The main purchase flow completes successfully across Chromium, Firefox, and WebKit. However, SCRUM-101 is not fully met because invalid checkout data can proceed, an empty cart can enter checkout, the cart omits its total, and Cancel from the overview does not return to the cart. Fix these behaviors before marking the story done. After fixes, rerun the failing acceptance tests in all three browser projects and retain the current assertions as regression coverage.

The application also emitted external telemetry 401 responses and navigation-related 404 responses during manual browsing. They did not block checkout and are not included as checkout defects.
