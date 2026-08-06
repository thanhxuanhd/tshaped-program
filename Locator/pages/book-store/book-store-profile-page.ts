import { Locator, type Page, expect } from "@playwright/test";

export class BookStoreProfilePage {
    private readonly userNameLocator: Locator;
    private readonly searchInputLocator: Locator;
    private readonly bookTableLocator: Locator;
    private readonly confirmButtionLocator: Locator;
    private readonly modalTextTileLocator: Locator;
    constructor(private page: Page) {
        this.userNameLocator = page.locator('label#userName-value');
        this.searchInputLocator = page.locator('input#searchBox');
        this.bookTableLocator = page.locator('table tbody');
        this.modalTextTileLocator = page.locator('div#example-modal-sizes-title-sm');
        this.confirmButtionLocator = page.locator('button#closeSmallModal-ok');
    }

    async navigateToProfile() {
        await this.page.goto('https://demoqa.com/profile');
    }

    async expectedLoadedToProfile(username: string) {
        await expect(this.userNameLocator).toBeVisible();
        expect(await this.userNameLocator.textContent()).toBe(username);
    }

    async searchBook(bookName: string) {
        await this.searchInputLocator.pressSequentially(bookName);
        await this.searchInputLocator.press('Tab');
    }

    async expectedBookVisible(bookName: string) {
        await expect(this.bookTableLocator.locator('tr')
            .filter({ hasText: bookName })).toBeVisible();
    }

    async deleteBook(bookName: string) {

        const buttonDelete = this.bookTableLocator.locator('tr')
            .filter({ hasText: bookName })
            .locator('td span[title="Delete"]');

        await buttonDelete.click();
    }

    async expectDeleteConfirmPopup() {
        await expect(this.modalTextTileLocator).toBeVisible();
        expect(await this.modalTextTileLocator.textContent()).toBe('Delete Book');
        await expect(this.confirmButtionLocator).toBeVisible();
    }

    async confirmDeleteBook() {
        await this.confirmButtionLocator.click();
    }

    async verifyBook(bookName: string) {
        const row = this.bookTableLocator.locator('tr').filter({ hasText: bookName });
        await expect(row).not.toBeVisible();
    }
}