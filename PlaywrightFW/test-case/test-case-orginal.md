# List of test cases

1. Login fails when username and password are both blank
2. Add a single product to cart - verify quality & cart page
3. Add the same product twice - quanlity increasents correct
4. Remove items from cart - one item and multiple items
5. Checkout succeeds with valid receiver info (COD)
6. Advanced - Update full name then clean up via API
7. Advanced - Verify order pages (seed the order via API)

Test case required 2, 5, 6

# Requirement
## Tech-stack
* TDD approach
* Playwright - Typescript
* Allure Report
* Github Acttion
* Data Driven (Json file)

## Requirement
* Apply the page object model
* Apply hook before / after
* Cleanup and setup data via api
* Test can run independently