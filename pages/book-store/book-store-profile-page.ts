import { Locator, type Page, expect } from "@playwright/test";
export class BookStoreProfilePage {
    constructor(private page: Page) {

    }
    
    async navigateToProfile() {
        await this.page.goto('https://demoqa.com/profile');
    }
}