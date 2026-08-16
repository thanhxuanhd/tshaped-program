import test, { expect } from '../core/fixtures/all.fixture';
import { ReportUtils, CurrencyUtils } from '../core';
import * as allure from 'allure-js-commons';
import accounts from '../resources/account.json';
import { IProduct } from '../core/models';

test.describe('Product Tests', () => {
    const account = accounts.find(acc => acc.role === 'customer') ?? { username: '', password: '', fullName: '' };

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
            await prepareDataService.cleanupUserData(account.fullName);
        });
    });

    test('Test 2: Add Single Product to Cart', { tag: '@mandatory' }, async ({ homePage, cartPage, prepareDataService }) => {
        let preparedProduct: IProduct;
        let productName: string;

        await allure.step('Prepare product data via API', async () => {
            [preparedProduct] = await prepareDataService.getRandomProducts(1);
            productName = preparedProduct.name;
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

        await allure.step('Verify cart page displays product details', async () => {
            await ReportUtils.attachScreenshot('Cart Page Screenshot', cartPage.page, async () => {
                const productDetails = await cartPage.getProductDetails(productName);
                const formattedPrice = CurrencyUtils.formatCurrency(preparedProduct?.price ?? 0);
                expect(productDetails.name).toBe(preparedProduct?.name);
                expect(productDetails.price).toBe(formattedPrice);
                expect(productDetails.quantity).toBe('1');
            });
        });
    });

    test('Test 3: Add the same product twice - quantity increases correct', { tag: '@advanced' }, async ({ homePage, cartPage, prepareDataService }) => {
        let preparedProduct: IProduct;
        let productName: string;

        await allure.step('Prepare product data via API', async () => {
            [preparedProduct] = await prepareDataService.getRandomProducts(1);
            productName = preparedProduct.name;
        });

        await allure.step('Add product to cart first time', async () => {
            await homePage.addProductToCart(productName);
        });

        await allure.step('Add same product to cart again', async () => {
            await homePage.addProductToCart(productName);
        });

        await allure.step('Navigate to cart page', async () => {
            await cartPage.navigateToCart();
        });

        await allure.step('Verify cart displays correct product details', async () => {
            await ReportUtils.attachScreenshot('Cart with Duplicate Product Screenshot', cartPage.page, async () => {
                const productDetails = await cartPage.getProductDetails(productName);
                expect(productDetails.name).toBe(preparedProduct?.name);
                expect(productDetails.quantity).toBe('2');
            });
        });
    });

    test('Test 4: Remove items from cart - one item and multiple items', { tag: '@advanced' }, async ({ homePage, cartPage, prepareDataService }) => {
        let product1: string;
        let product2: string;

        await allure.step('Prepare product data via API', async () => {
            const [preparedProduct1, preparedProduct2] = await prepareDataService.getRandomProducts(2);
            product1 = preparedProduct1.name;
            product2 = preparedProduct2.name;
        });

        await allure.step('Add products to cart', async () => {
            await ReportUtils.attachScreenshot('Add products to cart', cartPage.page, async () => {
                await homePage.addProductToCart(product1);
                await homePage.addProductToCart(product2);
                await homePage.addProductToCart(product1);
            });
        });

        await allure.step('Navigate to cart page', async () => {
            await cartPage.navigateToCart();
        });

        await allure.step('Verify products are in cart', async () => {
            const isProduct1InCart = await cartPage.verifyProductInCart(product1);
            const isProduct2InCart = await cartPage.verifyProductInCart(product2);
            expect(isProduct1InCart).toBe(true);
            expect(isProduct2InCart).toBe(true);

        });

        await allure.step('Verify quantities are in cart', async () => {
            const quantity1 = await cartPage.getProductQuantityByName(product1);
            const quantity2 = await cartPage.getProductQuantityByName(product2);
            expect(quantity1).toBe('2');
            expect(quantity2).toBe('1');
        });

        await allure.step('Remove single product from cart', async () => {
            await ReportUtils.attachScreenshot('Verify Products in Cart after remove', cartPage.page, async () => {
                await cartPage.removeItemFromCart(product1);
            });
        });

        await allure.step('Verify single product removed', async () => {
            const isProduct1InCart = await cartPage.verifyProductInCart(product1);
            expect(isProduct1InCart).toBe(false);
            const isProduct2InCart = await cartPage.verifyProductInCart(product2);
            expect(isProduct2InCart).toBe(true);
        });

        await allure.step('Remove remaining product from cart', async () => {
            await ReportUtils.attachScreenshot('Verify Products in Cart after remove', cartPage.page, async () => {
                await cartPage.removeItemFromCart(product2);
            });
        });

        await allure.step('Verify empty cart state', async () => {
            await ReportUtils.attachScreenshot('Empty Cart Screenshot', cartPage.page, async () => {
                const isCartEmpty = await cartPage.isCartEmpty();
                expect(isCartEmpty).toBe(true);
            });
        });
    });

    test('Test 5: Checkout with Valid Receiver Info (COD)', { tag: '@mandatory' }, async ({ homePage, cartPage, checkoutPage, page, prepareDataService }) => {
        let productName: string;
        const receiverInfo = {
            fullName: 'Nguyen Van B',
            phoneNumber: '0909123456',
            address: '123 ABC Street - HCM - Vietnam',
        };

        await allure.step('Prepare product data via API', async () => {
            const [preparedProduct] = await prepareDataService.getRandomProducts(1);
            productName = preparedProduct.name;
        });

        await allure.step('Add product to cart', async () => {
            await ReportUtils.attachScreenshot('Should see product in cart', page, async () => {
                await homePage.addProductToCart(productName);
            });
        });

        await allure.step('Navigate to cart page', async () => {
            await cartPage.navigateToCart();
        });

        await allure.step('Proceed to checkout', async () => {
            await ReportUtils.attachScreenshot('Should see checkout page', page, async () => {
                await cartPage.proceedToCheckout();
            });
        });

        await allure.step('Fill receiver information', async () => {
            await ReportUtils.attachScreenshot('Should see the Receiver Information', page, async () => {
                await checkoutPage.fillReceiverInformation(
                    receiverInfo.fullName,
                    receiverInfo.phoneNumber,
                    receiverInfo.address,
                );
            });
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