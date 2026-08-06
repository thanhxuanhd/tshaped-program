import { Locator, type Page, expect } from "@playwright/test";
export class BookStoreLoginPage {

    private readonly userNameLocator: Locator;
    private readonly passwordLocator: Locator;
    private readonly loginButtion: Locator;
    constructor(private page: Page) {
        this.userNameLocator = page.locator('#userForm input#userName');
        this.passwordLocator = page.locator('#userForm input#password');
        this.loginButtion = page.locator('#userForm button#login');
    }

    async navigateToLogin() {
        await this.page.goto('https://demoqa.com/login');
    }

    async loginToBookStore(username: string, password: string) {
       await this.userNameLocator.fill(username);
       await this.passwordLocator.fill(password);
       await this.loginButtion.click();
    }
}