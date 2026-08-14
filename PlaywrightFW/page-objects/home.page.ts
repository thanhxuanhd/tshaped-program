import { type Page } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
    private readonly productGridSectionLocator = this.page.locator('div.product-grid');
    private readonly productCart = this.page.locator('div.product-card');
    private readonly headerUsername = this.page.getByTestId('header-username');

    constructor(page: Page) {
        super(page);
    }

    async clickOnHeaderUsername() {
        this.clickOnElement(this.headerUsername);
    }

    async addProductToCart(productName: string) {
        const productCard = this.productCart.filter({ hasText: productName });
        const addToCartButton = productCard.locator('button');
        await this.clickOnElement(addToCartButton);
    }

    async getProductCount(): Promise<number> {
        return await this.countElements(this.productCart);
    }
}