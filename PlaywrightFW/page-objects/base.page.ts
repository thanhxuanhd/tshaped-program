import { expect, type Locator, type Page } from "@playwright/test";

export class BasePage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async openUrl(url: string) {
        await this.page.goto(url);
    }

    async enterText(element: Locator, text: string) {
        await element.clear()
        await element.fill(text);
    }

    async typeText(element: Locator, text: string, delay: number = 1000) {
        await element.pressSequentially(text, { delay });
    }

    async clickOnElement(element: Locator) {
        await element.click();
    }

    async getTextContent(element: Locator) {
        return await element.textContent();
    }

    async getInputValue(element: Locator) {
        return await element.inputValue();
    }

    async hoverOnElement(element: string) {
        await this.page.hover(element);
    }

    async awaitUntilVisiable(element: Locator, timeout?: number, message?: string) {
        await expect(element, message).toBeVisible({ timeout })
    }

    async awaitUntilHidden(element: Locator, timeout?: number, message?: string) {
        await expect(element, message).toBeHidden({ timeout })
    }

    async getText(element: Locator) {
        return await element.innerHTML();
    }

    async countElements(elements: Locator): Promise<number> {
        return await elements.count();
    }

    async awitForPageLoad(loadState?: 'load' | 'domcontentloaded' | 'networkidle') {
        return await this.page.waitForLoadState(loadState);
    }
}