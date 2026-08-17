import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class ProfilePage extends BasePage {
    private readonly fullNameInput = this.page.getByTestId('profile-name');
    private readonly saveChangesButton = this.page.getByTestId('profile-save');
    private readonly successMessage = this.page.getByTestId('profile-success');
    
    constructor(page: Page){
        super(page);
    }

    async openProfilePage() {
        await this.page.goto('/profile');
    }

    async updateFullName(fullName: string) {
        await this.enterText(this.fullNameInput, fullName);
    }

    async getFullName(): Promise<string> {
        return await this.fullNameInput.inputValue();
    }

    async saveChanges() {
        await this.clickOnElement(this.saveChangesButton);
    }

    async verifyProfileUpdated(fullName: string) {
        await expect(this.successMessage).toBeVisible();
        await expect(this.fullNameInput).toHaveValue(fullName);
    }
}