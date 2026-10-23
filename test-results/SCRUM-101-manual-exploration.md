# SCRUM-101 Manual Exploratory Results

**Application:** https://www.saucedemo.com

**Date:** 2026-10-23

**Browser:** Playwright MCP browser (Chromium)

**Mobile viewport checked:** 390 x 844

**Plan:** [../specs/saucedemo-checkout-test-plan.md](../specs/saucedemo-checkout-test-plan.md)

## Summary

Nine scenarios were executed. Five passed and four failed against the story's expected behavior. The happy-path order completed, and the cart was empty afterward. The observed failures are application behavior gaps, not test-tool failures.

| Scenario | Result | Observation |
|---|---|---|
| Cart details, total, and checkout choices | FAIL | Item name, description, quantity, price, and both actions are present, but the cart has no subtotal/total. |
| Required checkout fields | PASS | Empty submission reports First Name; after entering it, Last Name; after entering both, Postal Code. The page does not advance. |
| Reject special characters/non-numeric postal code | FAIL | `@@!!`, `#<>?`, and `abc-!?` were accepted and advanced to the overview. |
| Valid order overview and completion | PASS | Valid information advanced to overview; payment/shipping details and arithmetic were correct; Finish displayed confirmation and cleared the cart. |
| Cancel from checkout information | PASS | Cancel returned to the cart and preserved its item. |
| Cancel from order overview | FAIL | Cancel returned to the products page rather than the cart. The item remained in the cart. |
| Empty-cart checkout guard | FAIL | Checkout remained enabled in the empty cart and opened the checkout information form. |
| Unauthenticated direct checkout access | PASS | Direct navigation after logout redirected to login with an access-denied message. |
| Mobile checkout usability | PASS | At 390 x 844, information and overview pages were usable and document width matched viewport width (no horizontal overflow). |

## Defects Observed

### D-01 — Cart review omits the price total

**Severity:** Medium

**Acceptance criterion:** AC1

**Expected:** Cart shows total price calculation.

**Actual:** Cart lists quantity, item details and per-item prices, but has no subtotal or total.

**Evidence:** `../artifacts/cart-no-total.png`

### D-02 — Invalid non-empty checkout data is accepted

**Severity:** Medium

**Acceptance criterion:** AC5

**Expected:** Invalid names and postal codes are rejected with validation feedback.

**Actual:** Special-character-only names and a nonnumeric postal code advanced to the overview.

**Evidence:** `../artifacts/invalid-data-accepted.png`

### D-03 — Empty cart can proceed to checkout

**Severity:** Medium

**Business rule:** Cart cannot be empty when proceeding to checkout.

**Expected:** Checkout is unavailable or blocked while the cart is empty.

**Actual:** Checkout was enabled and opened the checkout information page.

### D-04 — Overview cancellation does not return to cart

**Severity:** Low

**Business rule:** Users can cancel checkout at any step and return to cart.

**Expected:** Cancel on the overview returns to the cart.

**Actual:** It returned to the products page; the cart contents were preserved.

## Evidence

- `../artifacts/cart-no-total.png` — cart contents with no total
- `../artifacts/invalid-data-accepted.png` — overview reached after invalid values
- `../artifacts/checkout-confirmation.png` — successful order confirmation
- `../artifacts/cart-mobile.png` — cart at mobile viewport

## Notes

The valid two-item overview showed item total `$45.98`, tax `$3.68`, and total `$49.66`. A separate one-item valid checkout showed `$29.99`, `$2.40`, and `$32.39`. The browser console also reported external telemetry 401 responses and 404 responses during navigation; these did not block the tested flows and are not counted as checkout defects.
