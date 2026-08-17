# Requirement Review

Overall coverage: **~85%**

| Requirement | Status | Evidence | Suggestion |
|---|---|---|---|
| Test case 2, 5, 6 are required | Pass | `tests/product-test.spec.ts:30-61`, `tests/product-test.spec.ts:135-187`, `tests/profile.spec.ts:29-51` | Keep these as the core smoke flow and avoid regressions in these specs. |
| Playwright + TypeScript | Pass | `playwright.config.ts:1-70`, all specs in `tests/*.spec.ts` | No change needed. |
| Allure Report | Pass | `playwright.config.ts:24-25`, `tests/login-test.spec.ts:3`, `tests/product-test.spec.ts:3`, `tests/profile.spec.ts:3`, `tests/order.spec.ts:3` | Keep step-level reporting in specs and attach screenshots only where they add value. |
| Page object model | Pass | `core/fixtures/page.fixture.ts:5-48`, `page-objects/*.ts` | Continue keeping locators/actions in page objects and assertions in specs. |
| Hooks before / after | Pass | `tests/login-test.spec.ts:12-16`, `tests/product-test.spec.ts:10-27`, `tests/profile.spec.ts:9-26`, `tests/order.spec.ts:16-58` | Preserve setup/cleanup hooks for shared test preparation. |
| Cleanup and setup data via API | Partial | `core/services/prepare-data.service.ts:18-115`, `tests/product-test.spec.ts:19-27`, `tests/profile.spec.ts:14-26`, `tests/order.spec.ts:26-57` | Fix and centralize API auth/header handling, then make cleanup methods explicit per entity (cart/order/profile). |
| Data driven (Json file) | Partial | `resources/account.json:1-8`, `tests/product-test.spec.ts:4-8`, `tests/profile.spec.ts:4-7`, `tests/order.spec.ts:4-8` | Move receiver data, product seeds, and expected test inputs into JSON fixtures instead of hardcoding them in specs. |
| GitHub Action | Missing | `test-case/test-case-orginal.md:18`, no `.github/workflows/*.yml` file is present in the repo | Add a workflow that runs `npm ci`, installs Playwright browsers, and executes `npx playwright test`. |
| Test can run independently | Mostly pass | `tests/product-test.spec.ts:10-27`, `tests/profile.spec.ts:9-26`, `tests/order.spec.ts:16-58` | Reduce shared-state risk by resetting all created data in each file and avoiding cross-test assumptions. |
| TDD approach | Not verifiable | `test-case/test-case-orginal.md:15` | If TDD is required, add a documented test-first workflow or PR evidence that tests were written before implementation. |

## Gaps and suggested changes

| Gap | Current issue | Suggested change |
|---|---|---|
| API auth handling | `PrepareDataService` stores `apiToken`, but the header usage is not clearly wired through the service. | Inject the token into a shared header builder and use it in all API methods. |
| Data coverage | Most test inputs are still hardcoded in specs. | Create JSON fixtures for receiver info, order data, and product scenarios. |
| CI coverage | No workflow file is visible under `.github/workflows`. | Add a GitHub Actions workflow to run the Playwright suite on push and pull request. |
| Cleanup safety | Cleanup methods depend on names and generic filters. | Use more precise identifiers or return IDs from setup to clean up exactly what the test created. |
| Assertion depth | Some checks only verify visibility or a single field. | Add stronger assertions for cart totals, order details, and profile update persistence. |

