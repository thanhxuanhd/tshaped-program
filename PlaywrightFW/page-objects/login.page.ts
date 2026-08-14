import { type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { expect } from "../core";

export class LoginPage extends BasePage {
    private readonly usernameLocator = this.page.locator('input#username');
    private readonly passwordLocator = this.page.locator('input#password');
    private readonly loginButtonLocator = this.page.getByTestId('login-submit');
    private readonly errorMessageLocator = this.page.locator('div.error-message[role="alert"]');

    constructor(page: Page) {
        super(page);
    }

    async fillUserName(username: string) {
        await this.enterText(this.usernameLocator, username);
    }

    async fillPassword(password: string) {
        await this.enterText(this.passwordLocator, password);
    }

    async clickLoginButtion() {
        await this.clickOnElement(this.loginButtonLocator)
    }

    async doLogin(username: string, password: string) {
        await this.fillUserName(username);
        await this.fillPassword(password);
        await this.clickLoginButtion();
    }

    async openUrl() {
        await this.page.goto('/login');
    }

    async verifyErrorMessageShowAndText(expectedText: string) {
        await expect(this.errorMessageLocator).toBeVisible();
        await expect(this.errorMessageLocator).toContainText(expectedText);
    }
}