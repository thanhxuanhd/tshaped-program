import { Locator, type Page, expect } from "@playwright/test";
export class BookStorePage {
    constructor(private page: Page) {

    }
    
    async navigateToBooks() {
        await this.page.goto('https://demoqa.com/books');
    }
}