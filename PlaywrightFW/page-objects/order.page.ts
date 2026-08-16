import { expect, type Page } from "@playwright/test";
import { BasePage } from "./base.page";
import { CurrencyUtils, OrderDetails } from "../core";

export class OrderPage extends BasePage {
    private readonly searchInputLocator = this.page.getByTestId('orders-search-input');
    private readonly ordersListLocator = this.page.locator('div.orders-list');
    private readonly ordersItem = 'order-card';
    private readonly orderStatus = 'div.order-card-header-right span.order-status';
    private readonly orderRecipient = 'div.order-recipient span';
    private readonly orderTotalPrice = 'div.order-footer-right span.order-total';

    constructor(page: Page) {
        super(page);
    }

    async navigateToOrders() {
        await this.page.goto('/orders');
    }

    async searchOrder(searchTerm: string) {
        await this.enterText(this.searchInputLocator, searchTerm);
    }

    async getOrderCount(): Promise<number> {
        return await this.countElements(this.ordersListLocator.getByTestId(this.ordersItem));
    }

    async verifyOrderExists(recipientName: string): Promise<boolean> {
        const order = this.ordersListLocator.filter({ hasText: recipientName });
        return (await order.count()) > 0;
    }

    async verifyOrderDetails({ recipientName, address, status = 'pending', totalPrice }: OrderDetails) {
        const order = this.ordersListLocator.filter({ hasText: recipientName });
        const orderRecipient = await order.locator(this.orderRecipient).allInnerTexts();
        const orderStatusLocator = order.locator(this.orderStatus);
        const orderTotalPriceLocator = order.locator(this.orderTotalPrice);
        const orderTotalPrice = await this.getTextContent(orderTotalPriceLocator);
        const expectedTotalPriceString = CurrencyUtils.formatCurrency(totalPrice);

        expect(order).toBeTruthy();
        expect(orderRecipient.some(text => text.includes(recipientName))).toBe(true);
        expect(orderRecipient.some(text => text.includes(address))).toBe(true);
        expect(await this.getText(orderStatusLocator)).toContain(status);
        expect(orderTotalPrice).toBe(expectedTotalPriceString);
    }
}