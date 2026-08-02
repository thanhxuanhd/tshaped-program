import { test as base } from '@playwright/test';
import { BookStoreLoginPage, BookStorePage, BookStoreProfilePage } from '../pages';

export type BookStoreFixture = {
    bookStorePage: BookStorePage;
    bookStoreLoginPage: BookStoreLoginPage;
    bookStoreProfilePage: BookStoreProfilePage;
}

export const test = base.extend<BookStoreFixture>({

    bookStorePage: async ({ page }, use) => {
        await use(new BookStorePage(page));
    },

    bookStoreLoginPage: async ({ page }, use) => {
        await use(new BookStoreLoginPage(page));
    },

    bookStoreProfilePage: async ({ page }, use) => {
        await use(new BookStoreProfilePage(page));
    }

});
