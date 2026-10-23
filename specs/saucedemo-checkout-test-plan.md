# SCRUM-101 SauceDemo Checkout Test Plan

## Application Overview

Validate SCRUM-101's checkout flow on https://www.saucedemo.com using standard_user / secret_sauce. Cover all acceptance criteria plus business rules, cancellation/navigation, authentication gating, and mobile layout. Assertions reflect the user story; gaps observed during exploration remain explicit expected outcomes for defect detection.

## Test Scenarios

### 1. Cart review

**Seed:** `tests/seed.spec.ts`

#### 1.1. Cart shows selected item details, total, and checkout choices

**File:** `tests/saucedemo-checkout/cart-review.spec.js`

**Steps:**
  1. Log in and add Sauce Labs Backpack and Sauce Labs Bolt T-Shirt to the cart.
    - expect: Cart badge shows 2.
  2. Open the cart.
    - expect: Both products show quantity, name, description, and price.
    - expect: A cart subtotal/total is displayed and equals the sum of prices.
    - expect: Continue Shopping and Checkout are available.

### 2. Checkout information

**Seed:** `tests/seed.spec.ts`

#### 2.1. Checkout information requires each field

**File:** `tests/saucedemo-checkout/checkout-validation.spec.js`

**Steps:**
  1. Log in, add one product, open the cart, and select Checkout.
    - expect: First Name, Last Name, and Zip/Postal Code fields are visible.
  2. Leave all fields empty and select Continue.
    - expect: Error identifies First Name as required; page does not advance.
  3. Enter First Name only and select Continue.
    - expect: Error identifies Last Name as required; page does not advance.
  4. Enter First and Last Name only and select Continue.
    - expect: Error identifies Postal Code as required; page does not advance.

#### 2.2. Checkout rejects invalid characters and postal codes

**File:** `tests/saucedemo-checkout/invalid-checkout-data.spec.js`

**Steps:**
  1. Log in, add one item, navigate to checkout, then enter special-character-only names and a nonnumeric postal code.
    - expect: Invalid values are rejected with a clear validation message.
    - expect: User remains on the information page until values are valid.

### 3. Order overview and confirmation

**Seed:** `tests/seed.spec.ts`

#### 3.1. Valid checkout displays correct overview and completes order

**File:** `tests/saucedemo-checkout/successful-checkout.spec.js`

**Steps:**
  1. Log in, add the Backpack ($29.99) and Bolt T-Shirt ($15.99), open the cart, and select Checkout.
    - expect: Checkout information page is displayed.
  2. Enter Ada, Lovelace, and 90210; select Continue.
    - expect: Overview shows both items, payment and shipping details, subtotal $45.98, tax $3.68, and total $49.66.
    - expect: Cancel and Finish actions are available.
  3. Select Finish.
    - expect: Confirmation displays a success message and Back Home control.
    - expect: Cart badge is empty.
  4. Select Back Home and open the cart.
    - expect: Products page displays and the cart remains empty.

### 4. Navigation and checkout guardrails

**Seed:** `tests/seed.spec.ts`

#### 4.1. Cancel checkout information returns to cart

**File:** `tests/saucedemo-checkout/cancel-checkout.spec.js`

**Steps:**
  1. Log in, add one product, open cart, and select Checkout.
    - expect: Checkout information page is displayed.
  2. Select Cancel.
    - expect: Returns to cart with the item preserved.

#### 4.2. Cancel order overview returns to cart

**File:** `tests/saucedemo-checkout/cancel-overview.spec.js`

**Steps:**
  1. Log in, add one item, enter valid checkout information, and continue.
    - expect: Overview displays the selected product.
  2. Select Cancel.
    - expect: Returns to cart with the item preserved.

#### 4.3. Empty cart cannot proceed to checkout

**File:** `tests/saucedemo-checkout/empty-cart-checkout.spec.js`

**Steps:**
  1. Log in and open the cart without adding items.
    - expect: Cart is empty; checkout is unavailable or blocked.
  2. Attempt to proceed to checkout if a control is present.
    - expect: Checkout cannot proceed with an empty cart.

#### 4.4. Unauthenticated user cannot access checkout directly

**File:** `tests/saucedemo-checkout/authentication-gating.spec.js`

**Steps:**
  1. Log in, use the navigation menu to log out, then navigate directly to /checkout-step-one.html.
    - expect: Redirected to login page; checkout fields are not exposed.

### 5. Responsive checkout

**Seed:** `tests/seed.spec.ts`

#### 5.1. Checkout remains usable on a mobile viewport

**File:** `tests/saucedemo-checkout/mobile-checkout.spec.js`

**Steps:**
  1. Set viewport to 390x844, log in, add an item, open cart, and select Checkout.
    - expect: Information fields/actions are usable and no horizontal overflow is present.
  2. Enter valid information and continue.
    - expect: Overview, totals, and actions remain readable and usable.
