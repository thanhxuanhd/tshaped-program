import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class OrderPage extends BasePage {
    private readonly searchInputLocator = this.page.getByTestId('orders-search-input');

    constructor(page: Page) {
        super(page);
    }
}