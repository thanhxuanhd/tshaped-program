This project is a pet project to practice Playwright automation testing.

## The `Locator` project is a practice test suite for the `demoqa.com` website.
### How to run project
* Rename the `.env.example` to `.env` 
* Fill in the username and password already register in `demoqa.com`
* Run the text with command `npx playwright test`

## PlaywrightFW
`PlaywrightFW` is the final assignment Playwright framework project. It implements the planned E2E scenarios in `PlaywrightFW/test-case/plan.md`, including:

| Test case | Coverage | Status |
| --- | --- | --- |
| Test 1 | Login fails when username and password are both blank | Implemented |
| Test 2 | Add a single product to cart and verify cart quantity/details | Implemented |
| Test 3 | Add the same product twice - quantity increments correctly | Implemented |
| Test 4 | Remove items from cart - one item and multiple items | Implemented |
| Test 5 | Checkout succeeds with valid receiver info (COD) | Implemented |
| Test 6 | Update full name then clean up via API | Implemented |
| Test 7 | Verify order pages by seeding the order via API | Implemented |

### How to run
* Install dependencies: `npm ci`
* Install Playwright browsers: `npx playwright install --with-deps`
* Run all tests: `npx playwright test`
* Run a single test: `npx playwright test tests/example.spec.ts`
* Run by title: `npx playwright test --grep "test title"`
* Run Chromium only: `npx playwright test --project=chromium`

### Generate reports
* Generate the Allure report: `npx allure generate ./reports/allure-results -o ./reports/allure-report`
* Open the Allure report: `npx allure open ./reports/allure-report`
* Open the Playwright HTML report: `npx playwright show-report ./reports/playwright-report`

## GitHub Actions Pipeline
The project includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that automatically runs tests on every push and pull request to the `main` or `master` branches. The pipeline:
* Runs tests in parallel using **2 workers** by default for faster execution
* Generates both Playwright and Allure reports
* Uploads test reports as artifacts for review
* Can be manually triggered with custom parameters (e.g., specific test tags or custom worker count)
