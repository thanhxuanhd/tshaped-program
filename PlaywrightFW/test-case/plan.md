# Playwright E2E Test Implementation Plan (5-Day Phase-Based)

## Overview
Implement 3 required test cases following the test-case-orginal.md requirements using the existing Playwright framework with TDD approach, page object model, hooks, and API-driven data setup/cleanup.

**Required Tests:**
- Test 2: Add a single product to cart - verify quality & cart page
- Test 5: Checkout succeeds with valid receiver info (COD)
- Test 6: Advanced - Update full name then clean up via API

## Tech Stack & Constraints
- Playwright + TypeScript
- Page Object Model (already in place)
- Hooks (before/after test setup)
- API-driven setup/cleanup
- Allure Report integration
- GitHub Actions CI (forbidOnly enabled)
- Test data via JSON files (assumed to exist)
- Independent test execution (no test dependencies)

---

## Phase 1: Analysis & Framework Assessment (Days 1-2)

### Goals
Understand the application under test and prepare the framework for test implementation.

### Activities
1. **Application Analysis**
   - Document the application's main workflows (login, product browsing, cart, checkout)
   - Identify required UI elements and their selectors for each test
   - Map the checkout flow and payment method options (COD)
   - Document user profile update workflow

2. **Framework Audit**
   - Review existing page objects (LoginPage, HomePage, ProfilePage, BasePage)
   - Review existing fixtures structure (all.fixture.ts, page.fixture.ts)
   - Review existing hooks structure (understand current before/after setup)
   - Confirm API helper pattern and implementation approach

3. **Page Object Gap Analysis**
   - Identify missing page objects needed:
     - CartPage (product display, quantity, remove button, cart totals)
     - CheckoutPage (shipping info, payment method selection, order confirmation)
     - Product selection/catalog interaction (may be part of HomePage)
   - List required locators and actions for each page object

4. **Documentation**
   - Create a mapping of test scenarios to required page interactions
   - Document expected API endpoints for data setup/cleanup
   - Document test data requirements (products, user info, payment methods)

---

## Phase 2: Framework Enhancement & API Setup (Days 2-3)

### Goals
Prepare the framework infrastructure to support the 3 required tests.

### Activities
1. **Page Object Implementation**
   - Define CartPage structure (add to cart, view cart, remove items, verify quantity, verify totals)
   - Define CheckoutPage structure (enter shipping info, select payment method, submit order)
   - Enhance HomePage if needed (product selection, add to cart actions)
   - Enhance ProfilePage if needed (user info display and update)
   - Register all new page objects in page-objects/index.ts
   - Register fixtures in core/fixtures/page.fixture.ts

2. **Hooks Setup**
   - Define beforeEach hook: login user, navigate to appropriate starting point
   - Define afterEach hook: cleanup cart/orders via API, verify test isolation
   - Determine shared vs. test-specific setup/teardown
   - Establish hook best practices (avoid shared state)

3. **API Helper Development**
   - Define API endpoints needed:
     - Product API (get product details, search)
     - Cart API (add product, remove item, get cart)
     - Order/Checkout API (create order, verify order status)
     - User API (get profile, update profile)
   - Structure API helper class with methods for each endpoint
   - Implement error handling and response validation
   - Document API request/response format

4. **Test Data Structure**
   - Review existing JSON data files (test-case-orginal.md mentions data-driven approach)
   - Ensure data files have required test scenarios
   - Document data structure for product objects, user objects, payment info
   - Plan cleanup strategy (API calls to remove orders, reset user data)

---

## Phase 3: Test Case Implementation (Days 3-4)

### Goals
Implement the 3 required test cases following framework patterns and TDD approach.

### Test 2: Add Single Product to Cart
- **Preconditions**: User logged in
- **Steps**:
  1. Navigate to product catalog
  2. Select a product
  3. Add to cart
  4. Verify product appears in cart
  5. Verify quantity is correct
  6. Verify cart page displays product details
- **Postconditions**: Clean up via API (remove cart/order)
- **Test Structure**:
  - Use page fixtures for HomePage, CartPage, LoginPage
  - Use API helper for cleanup
  - Use Allure metadata (feature, story, severity)
  - Include step-level reporting

### Test 5: Checkout with Valid Receiver Info (COD)
- **Preconditions**: User logged in, products in cart
- **Setup**: Use API to add products to cart (or UI add)
- **Steps**:
  1. Navigate to cart
  2. Proceed to checkout
  3. Enter/select valid shipping address
  4. Select COD payment method
  5. Confirm order
  6. Verify order confirmation page
- **Postconditions**: Clean up order via API
- **Test Structure**:
  - Use page fixtures for CartPage, CheckoutPage
  - Use hooks for login + product setup
  - Use API for order verification/cleanup
  - Include assertion for order status

### Test 6: Update Full Name Then Clean Up via API
- **Preconditions**: User logged in
- **Steps**:
  1. Navigate to profile/account page
  2. Update full name field
  3. Save changes
  4. Verify update success (UI confirmation or page refresh)
  5. Clean up: revert name via API
- **Test Structure**:
  - Use ProfilePage fixture
  - Use API helper for cleanup (user update endpoint)
  - Demonstrate test independence (cleanup runs via API)
  - Include Allure metadata for advanced test

### Implementation Approach for All Tests
- Import test and expect from core/fixtures/all.fixture.ts (not @playwright/test)
- Use custom fixtures (basePage, loginPage, homePage, etc.)
- Use test.describe() for grouping
- Use allure.step() for step reporting
- Use Allure metadata (epic, feature, story, severity)
- Attach screenshots/artifacts on failure
- Ensure tests are idempotent and can run in any order

---

## Phase 4: Integration, Validation & Documentation (Days 4-5)

### Goals
Validate all tests run successfully and document implementation.

### Activities
1. **Local Test Execution**
   - Run individual tests locally to verify functionality
   - Run all 3 tests together to verify independence
   - Run in parallel mode to verify no race conditions
   - Verify cleanup is working (no test data pollution)

2. **Report Generation**
   - Generate Allure report locally (npx allure generate)
   - Review report for coverage and metadata
   - Verify report shows all test steps and assertions
   - Check quality gate (max 5 failures per allurerc.mjs config)

3. **CI Integration Validation**
   - Ensure GitHub Actions workflow runs successfully
   - Verify tests run with CI settings (forbidOnly, 1 worker, headless, 2 retries)
   - Validate Allure report generation in CI pipeline
   - Check for any flakiness or timing issues

4. **Documentation & Best Practices**
   - Document page objects (locators and actions available)
   - Document API helper methods (endpoints, parameters, cleanup)
   - Document test data requirements and where to find JSON files
   - Document how to run tests locally vs. CI
   - Document test naming conventions and structure
   - Create README or wiki section for future maintainers

5. **Code Review & Cleanup**
   - Review all test files for consistency
   - Verify POM principles are followed (no UI details in tests)
   - Ensure hooks are properly isolated and don't create dependencies
   - Verify API cleanup is complete (no orphaned test data)
   - Remove any debug code or temporary changes

---

## Deliverables by Phase

| Phase | Days | Deliverables |
|-------|------|--------------|
| 1 | 1-2 | Application analysis doc, page object requirements, API endpoint mapping |
| 2 | 2-3 | CartPage + CheckoutPage + ProfilePage implementations, hooks setup, API helper structure, test data review |
| 3 | 3-4 | Test 2 implementation, Test 5 implementation, Test 6 implementation (all with fixtures, hooks, cleanup) |
| 4 | 4-5 | Local test runs passing, Allure reports generated, CI validation passing, documentation complete |

---

## Key Implementation Notes

1. **Test Independence**: Each test must not depend on state from other tests. Use afterEach hooks for cleanup.
2. **POM Compliance**: Locators in page objects must be private readonly; tests must use public methods only.
3. **API-Driven Setup/Cleanup**: Leverage API helper to set up test data and clean up after tests (especially Test 5 & 6).
4. **Allure Reporting**: Include epic, feature, story, and severity metadata on all tests for comprehensive reporting.
5. **Fixture Pattern**: Use the custom test fixture from core/fixtures/all.fixture.ts to access page objects directly.
6. **Hook Strategy**: Implement shared hooks (login, navigation) but keep test-specific setup in beforeEach where needed.
7. **No Code Changes Outside Tests**: Framework is ready; only test spec files need to be created/modified.

---

## Timeline Summary

- **Days 1-2**: Understand application, audit framework, identify gaps
- **Days 2-3**: Create missing page objects, set up hooks, finalize API helpers
- **Days 3-4**: Write Test 2, Test 5, Test 6 specs with all fixtures and cleanup
- **Days 4-5**: Validate locally, generate reports, run CI, document, review

# Playwright Test Plan for Remaining Cases

## Current status
Test cases 1, 2, 5, and 6 are already complete. The remaining work is limited to the unresolved scenarios from the original list:
- Test 3: Add the same product twice - quantity increases correctly
- Test 4: Remove items from cart - one item and multiple items
- Test 7: Advanced - Verify order pages (seed the order via API)

This update focuses only on the remaining plan items. No code changes are required in this step.

## Goal
Complete the remaining Playwright test coverage using the existing framework patterns: TDD, page object model, hooks, API-driven setup/cleanup, and independent test execution.

## Scope
- Reuse current fixtures, page objects, and helper structure already established for completed tests.
- Add or complete only the missing test logic for the remaining cases.
- Keep each test isolated and runnable by itself without depending on previous test state.

## Implementation tasks
1. Review the current cart and order fixture coverage to confirm what remains missing for Test 3 and Test 4.
2. Confirm the API helper strategy needed for Test 7 to seed and verify order-page state.
3. Implement Test 3
   - Add the same product twice from the product page or catalog
   - Assert the quantity increments appropriately in the cart
   - Validate the cart summary/state matches expected behavior
4. Implement Test 4
   - Remove a single product from the cart and verify the item disappears
   - Remove multiple products and verify the cart updates correctly
   - Validate empty-state or recalculated totals if applicable
5. Implement Test 7
   - Seed an order through API
   - Navigate to the relevant order page(s)
   - Verify the order details and status appear as expected
   - Clean up the seeded data using API cleanup where needed
6. Validate independence and cleanup
   - Run the remaining cases individually and together
   - Confirm no cross-test data leakage
   - Verify API cleanup resets cart/order/user state as expected

## Notes
- Keep the same test conventions already used by the completed cases.
- Prefer the existing POM and fixture pattern rather than introducing new framework patterns.
- Use API setup/cleanup for stateful scenarios, especially cart/order validation.
- No broad refactor is needed; this is a targeted completion of the remaining test cases only.

## Completion criteria
The plan is complete when:
- Test 3 has explicit duplicate-add quantity validation
- Test 4 covers single-item and multi-item removal flows
- Test 7 seeds data via API and verifies order pages successfully
- The remaining tests pass independently and leave no leftover state behind