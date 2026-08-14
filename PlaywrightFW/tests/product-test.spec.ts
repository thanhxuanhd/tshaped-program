import test, { expect } from '../core/fixtures/all.fixture';
import { ReportUtils } from '../core';
import * as allure from 'allure-js-commons';
import accounts from '../resources/account.json';
import { IProduct } from '../core/models';

test.describe('Home Page Tests', () => {
    const account = accounts.find(acc => acc.role === 'customer') ?? { username: '', password: '' };

    test.beforeEach(async ({ loginPage, prepareDataService }) => {

        await allure.step('Navigate to login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Perform login', async () => {
            await loginPage.doLogin(account.username, account.password);
        });

        await allure.step('Prepare user data via API', async () => {
            await prepareDataService.prepareUserData(account.username, account.password);
        });

    });

    test.afterEach(async ({ prepareDataService }) => {
        await allure.step('Clean up cart via API', async () => {
            await prepareDataService.cleanupUserData();
        });
    });

    test('Test 2: Add Single Product to Cart', { tag: '@mandatory' }, async ({ homePage, cartPage, prepareDataService }) => {
        const productName = 'Túi xách nữ';
        let preparedProduct: IProduct | undefined;

        await allure.step('Prepare product data via API', async () => {
            preparedProduct = await prepareDataService.findProduct(productName);
            expect(preparedProduct).toBeTruthy();
        });

        await allure.step('Add single product to cart', async () => {
            await homePage.addProductToCart(productName);
        });

        await allure.step('Navigate to cart page', async () => {
            await cartPage.navigateToCart();
        });

        await allure.step('Verify product appears in cart', async () => {
            const isProductInCart = await cartPage.verifyProductInCart(productName);
            expect(isProductInCart).toBe(true);
        });

        await allure.step('Verify quantity is correct', async () => {
            const quantity = await cartPage.getProductQuantityByName(productName);
            expect(quantity).toBe('1');
        });


        await allure.step('Verify cart page displays product details', async () => {
            await ReportUtils.attachScreenshot('Cart Page Screenshot', cartPage.page, async () => {
                const productDetails = await cartPage.getProductDetails(productName);
                expect(productDetails.name).toBe(preparedProduct?.name);
                expect(productDetails.price).toBe(preparedProduct?.price);
                expect(productDetails.quantity).toBe('1');
            });
        });
    });

    test('Test 5: Checkout with Valid Receiver Info (COD)', { tag: '@mandatory' }, async ({ homePage, cartPage, checkoutPage, page }) => {
        const productName = 'Kính mát';
        const receiverInfo = {
            fullName: 'Nguyen Van B',
            phoneNumber: '0909123456',
            address: '123 ABC Street - HCM - Vietnam',
        };

        await allure.step('Add product to cart', async () => {
            await homePage.addProductToCart(productName);
        });

        await allure.step('Navigate to cart page', async () => {
            await cartPage.navigateToCart();
        });

        await allure.step('Proceed to checkout', async () => {
            await cartPage.proceedToCheckout();
        });

        await allure.step('Fill receiver information', async () => {
            await checkoutPage.fillReceiverInformation(
                receiverInfo.fullName,
                receiverInfo.phoneNumber,
                receiverInfo.address,
            );
        });

        await allure.step('Select COD payment method', async () => {
            await checkoutPage.selectCodPaymentMethod();
        });

        await allure.step('Place order', async () => {
            await checkoutPage.placeOrder();
        });

        await allure.step('Verify order success page', async () => {
            await ReportUtils.attachScreenshot('Checkout Success Page Screenshot', page, async () => {
                await checkoutPage.verifyOrderSuccessPage(receiverInfo.fullName, receiverInfo.address);
            });
        });
    });

});