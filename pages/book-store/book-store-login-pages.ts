import { Locator, type Page, expect } from "@playwright/test";
export class BookStoreLoginPage {
    constructor(private page: Page) {

    }
    
    async navigateToLogin() {
        await this.page.goto('https://demoqa.com/login');
    }
}