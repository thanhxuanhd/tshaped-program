import { type Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
    private readonly cartItemsLocator = this.page.locator('div.cart-item');
    private readonly cartItemEmptyShopBtnLocator = this.page.locator('div.cart-empty button.shop-btn');
    private readonly cartItemName = 'div.item-info h3';
    private readonly cartItemPrice = 'div.item-total';
    private readonly cartItemQuantity = 'div.item-qty span.qty-value';
    private readonly cartItemRemoveButton = 'button.remove-btn';

    private readonly cartTotalLocator = this.page.locator('div.summary-total span');
    private readonly proceedCheckoutButtonLocator = this.page.locator('div.cart-summary button.checkout-btn');

    constructor(page: Page) {
        super(page);
    }

    async navigateToCart() {
        await this.page.goto('/cart');
    }

    async getCartItemCount(): Promise<number> {
        return await this.countElements(this.cartItemsLocator);
    }

    async waitForCartItemCount(expectedCount: number) {
        await expect(this.cartItemsLocator).toHaveCount(expectedCount);
    }

    async getProductQuantityByName(productName: string): Promise<string | null> {
        const quantityInput = this.cartItemsLocator.filter({ hasText: productName }).locator(this.cartItemQuantity);
        return await quantityInput.innerText();
    }

    async verifyProductInCart(productName: string): Promise<boolean> {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        return (await productItem.count()) > 0;
    }

    async waitForProductInCart(productName: string) {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        await expect(productItem).toHaveCount(1);
    }

    async waitForProductNotInCart(productName: string) {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        await expect(productItem).toHaveCount(0);
    }

    async getProductDetails(productName: string) {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        const name = await productItem.locator(this.cartItemName).textContent();
        const price = await productItem.locator(this.cartItemPrice).textContent();
        const quantity = await productItem.locator(this.cartItemQuantity).textContent();
        
        return {
            name,
            price,
            quantity
        };
    }

    async removeItemFromCart(productName: string) {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        const removeButton = productItem.locator(this.cartItemRemoveButton);
        await this.clickOnElement(removeButton);
    }

    async proceedToCheckout() {
        await this.clickOnElement(this.proceedCheckoutButtonLocator);
    }

    async getCartTotal(): Promise<string[]> {
        return await this.cartTotalLocator.allInnerTexts();
    }

    async isCartEmpty(): Promise<boolean> {
        return await this.cartItemEmptyShopBtnLocator.isVisible();
    }

    async waitForCartEmpty() {
        await expect(this.cartItemEmptyShopBtnLocator).toBeVisible();
    }
}
