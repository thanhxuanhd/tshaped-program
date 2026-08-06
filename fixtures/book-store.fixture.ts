import { test as base, expect, request as apiRequest } from '@playwright/test';
import { BookStoreLoginPage, BookStorePage, BookStoreProfilePage } from '../pages';
import { ApiHelper } from '../api/api.helper';
import { ACCOUNT_DETAIL, ACCOUNT_LOGIN, APP_URL, GET_BOOK } from '../tests/constant';

const username = process.env.username || '';
const password = process.env.password || '';
const bookName = 'Git Pocket Guide';

interface LoginData {
    token: string;
    userId: string;
}

interface BookItem {
    isbn: string;
    title: string;
}

export type BookStoreFixture = {
    bookStorePage: BookStorePage;
    bookStoreLoginPage: BookStoreLoginPage;
    bookStoreProfilePage: BookStoreProfilePage;
    setupBookInProfile: void;
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
    },
    setupBookInProfile: [async ({}, use) => {
        // Create API context
        const apiRequestContext = await apiRequest.newContext({ baseURL: APP_URL });
        const apiHelper = new ApiHelper(apiRequestContext);

        // Login via API
        const loginData = await apiHelper.postJson<LoginData>(ACCOUNT_LOGIN, {
            data: { userName: username, password: password },
        });
        const { token, userId } = loginData;

        // Fetch user's current books
        const userDetail = await apiHelper.getJson<{ books: BookItem[] }>(
            `${ACCOUNT_DETAIL}/${userId}`,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        // Fetch all available books to find target ISBN
        const booksData = await apiHelper.getJson<{ books: BookItem[] }>(GET_BOOK);
        const targetBook = booksData.books.find(b => b.title === bookName);

        if (!targetBook) {
            throw new Error(`Book "${bookName}" not found in store`);
        }

        const alreadyAdded = userDetail.books ? userDetail.books.some(b => b.title === bookName) : false;

        if (!alreadyAdded) {
            await apiHelper.post(GET_BOOK, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                data: { userId, collectionOfIsbns: [{ isbn: targetBook.isbn }] },
            });
        }

        await use();
        await apiRequestContext.dispose();
    }, { auto: false }],
});
export { expect };

