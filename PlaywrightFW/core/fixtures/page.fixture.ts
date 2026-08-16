import { BasePage, HomePage, LoginPage, ProfilePage, CartPage, CheckoutPage, OrderPage } from '../../page-objects'
import { type test as base } from '@playwright/test'
import { PrepareDataService } from '../services';

export type PageFixtures = {
    basePage: BasePage,
    loginPage: LoginPage,
    homePage: HomePage,
    profilePage: ProfilePage,
    cartPage: CartPage,
    checkoutPage: CheckoutPage,
    orderPage: OrderPage,
    prepareDataService: PrepareDataService
}

type ExtendParams = Parameters<typeof base.extend<PageFixtures>>;

export const pageFixtures: ExtendParams[0] = {
    page: async ({ page }, use) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('shopvn_lang', 'en');
        });
        await use(page);
    },
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    profilePage: async ({ page }, use) => {
        await use(new ProfilePage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },
    orderPage: async ({ page }, use) => {
        await use(new OrderPage(page));
    },
    prepareDataService: async ({ request }, use) => {
        await use(new PrepareDataService(request));
    },
}