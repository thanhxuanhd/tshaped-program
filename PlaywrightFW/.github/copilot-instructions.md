# Copilot Instructions — Playwright E2E Framework

## Commands

This repository has no npm build, lint, or test scripts. Use the installed CLIs directly:

```bash
npm ci
npx playwright install --with-deps
npx playwright test
npx playwright test tests/example.spec.ts
npx playwright test --grep "test title"
npx playwright test --project=chromium
npx playwright show-report ./reports/playwright-report
npx allure generate ./reports/allure-results -o ./reports/allure-report
npx allure open ./reports/allure-report
```

GitHub Actions runs `npm ci`, installs Playwright browsers, and executes `npx playwright test`. Locally, test files run in parallel; CI uses one worker, retries twice, and runs headlessly. `forbidOnly` is enabled in CI.

## Architecture

- `playwright.config.ts` discovers `tests/**/*.spec.ts`, runs the Chromium desktop project, and emits both the Playwright HTML report and raw Allure results under `reports/`.
- Tests can use Playwright directly or the extended fixture in `core/fixtures/all.fixture.ts`. Its default `test` export and named `expect` inject `basePage`, `loginPage`, `homePage`, and `profilePage`, and override `page` to set `shopvn_lage=en` in local storage before page creation. `core/index.ts` does not re-export that default fixture.
- Page objects in `page-objects/` extend `BasePage`, which centralizes page interactions and wait helpers. Every page object must also be exported from `page-objects/index.ts` and registered in `core/fixtures/page.fixture.ts` to be available as a typed test fixture.
- `core/api/` is the home for API-assisted test-data setup and cleanup, while `core/utils/` contains shared reporting support. The intended test scope and requirements, including API cleanup, JSON-driven data, hooks, and independent tests, are in `test-case/test-case-orginal.md`.
- `allurerc.mjs` configures the generated Allure report, including the Awesome plugin, a single-file English report, and a quality gate of at most five failures.

## Conventions

- For tests that use framework page fixtures, import the default `test` and named `expect` from `core/fixtures/all.fixture`, not `@playwright/test`. Existing basic example tests use the Playwright import directly because they do not consume custom fixtures.
- Keep UI assertions in specs. Page objects expose actions and state through async methods; define their locators as `private readonly` and build them from the inherited `page`.
- When adding a page object, complete all three integration points: its `<name>.page.ts` class, the `page-objects/index.ts` barrel export, and the `PageFixtures` type plus fixture factory in `core/fixtures/page.fixture.ts`.
- Use `<name>.page.ts`, `<name>.spec.ts`, `<name>.fixture.ts`, `<name>.helper.ts`, `<name>.utils.ts`, and `<name>.data.json` naming. Group specs with `test.describe()` and give tests behavior-focused titles.
- Tests must not depend on state created by another test. Use hooks for shared navigation and API helpers for setup/cleanup rather than direct API calls in specs. Use JSON data or in-code arrays for parameterized flows.
- Keep Allure metadata and step-level reporting in specs: use `allure.step()`, feature hierarchy metadata (`epic`, `feature`, `story`, `severity`), and failure attachments when useful.

## Copilot Agents and MCP

The repository provides `playwright-test-generator`, `playwright-test-healer`, and `playwright-test-planner` agents in `.github/agents/`. They use the `playwright-test` MCP server, configured in `.vscode/mcp.json` to run `npx playwright run-test-mcp-server`. Use the generator for implementing a planned browser scenario and the healer to diagnose a failing Playwright test; the healer requires a rerun after each fix.
