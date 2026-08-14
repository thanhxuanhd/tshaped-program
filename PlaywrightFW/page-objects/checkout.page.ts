import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CheckoutPage extends BasePage {
    private readonly fullNameLocator = this.page.getByTestId('checkout-name');
    private readonly phoneNumberLocator = this.page.getByTestId('checkout-phone');
    private readonly addressLocator = this.page.getByTestId('checkout-address');
    private readonly codPaymentMethodLocator = this.page.locator('input[type="radio"][value="cod"]');
    private readonly placeOrderButtonLocator = this.page.getByTestId('checkout-submit');
    private readonly orderSuccessHeadingLocator = this.page.getByTestId('order-success-heading');

    constructor(page: Page) {
        super(page);
    }

    async fillReceiverInformation(fullName: string, phoneNumber: string, address: string) {
        await this.enterText(this.fullNameLocator, fullName);
        await this.enterText(this.phoneNumberLocator, phoneNumber);
        await this.enterText(this.addressLocator, address);
    }

    async selectCodPaymentMethod() {
        await this.clickOnElement(this.codPaymentMethodLocator);
    }

    async placeOrder() {
        await this.clickOnElement(this.placeOrderButtonLocator);
    }

    async verifyOrderSuccessPage(fullName: string, address: string) {
        await expect(this.orderSuccessHeadingLocator).toBeVisible();
        await expect(this.page.getByText(fullName)).toBeVisible();
        await expect(this.page.getByText(address)).toBeVisible();
    }
}
