import { test } from '../fixtures/book-store.fixture';

const username = process.env.username || '';
const password = process.env.password || '';
const bookName = 'Git Pocket Guide';


test('Delete Book exists in profile', async ({ bookStoreLoginPage, bookStoreProfilePage, setupBookInProfile }) => {
    await bookStoreLoginPage.navigateToLogin();
    await bookStoreLoginPage.loginToBookStore(username, password);

    await bookStoreProfilePage.expectedLoadedToProfile(username);

    await bookStoreProfilePage.searchBook(bookName);
    await bookStoreProfilePage.expectedBookVisible(bookName);
    await bookStoreProfilePage.deleteBook(bookName);

    await bookStoreProfilePage.expectDeleteConfirmPopup();

    await bookStoreProfilePage.confirmDeleteBook();

    await bookStoreProfilePage.verifyBook(bookName);
});