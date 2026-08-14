import { type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class CartPage extends BasePage {
    private readonly cartItemsLocator = this.page.locator('div.cart-item');
    private readonly cartItemName = 'div.item-info h3';
    private readonly cartItemPrice = 'div.item-qty span.qty-value';
    private readonly cartItemQuantity = 'div.item-qty span.qty-value';
    private readonly cartItemRemoveButton = 'button.remove-btn';

    private readonly cartTotalLocator = this.page.locator('div.cart-total');
    private readonly proceedCheckoutButtonLocator = this.page.getByTestId('proceed-checkout');

    constructor(page: Page) {
        super(page);
    }

    async navigateToCart() {
        await this.page.goto('/cart');
    }

    async getCartItemCount(): Promise<number> {
        return await this.countElements(this.cartItemsLocator);
    }

    async getProductQuantityByName(productName: string): Promise<string | null> {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        const quantityInput = productItem.locator(this.cartItemQuantity);
        return await quantityInput.inputValue();
    }

    async verifyProductInCart(productName: string): Promise<boolean> {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        return (await productItem.count()) > 0;
    }

    async getProductDetails(productName: string) {
        const productItem = this.cartItemsLocator.filter({ hasText: productName });
        const name = await productItem.locator(this.cartItemName).textContent();
        const price = await productItem.locator(this.cartItemPrice).textContent();
        const quantity = await productItem.locator(this.cartItemQuantity).inputValue();
        
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

    async getCartTotal(): Promise<string | null> {
        return await this.getTextContent(this.cartTotalLocator);
    }
}
