import test from '../core/fixtures/all.fixture';
import { ReportUtils } from '../core';
import * as allure from 'allure-js-commons';
import accounts from '../resources/account.json';
import testData from '../resources/test-data.json';
import type { IOrder, IProduct, OrderPaymentMethod, OrderStatus } from '../core/models';

test.describe('Order Page Tests', () => {
    const account = accounts.find(acc => acc.role === 'customer') ?? { username: '', password: '', fullName: '' };

    let preparedProduct: IProduct | undefined;
    const orderData = testData.order as {
        recipientName: string;
        recipientPhone: string;
        address: string;
        quantity: number;
        paymentMethod: OrderPaymentMethod;
        status: OrderStatus;
        expectedStatus: string;
    };
    const { recipientName,
            recipientPhone, address,
            quantity, paymentMethod,
            status,
            expectedStatus
        } = orderData;
    let order: IOrder;

    test.beforeEach(async ({ loginPage, prepareDataService }) => {

        await allure.step('Navigate to login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Perform login', async () => {
            await loginPage.doLogin(account.username, account.password);
        });

        await allure.step('Prepare user data via API', async () => {
            await prepareDataService.prepareUserData(account.username, account.password);
            await prepareDataService.cleanupOrder({ search: recipientName });
        });

        await allure.step('Prepare product data via API', async () => {
            [preparedProduct] = await prepareDataService.getRandomProducts(1);
            order = {
                items: [{
                    productId: preparedProduct?._id || '',
                    name: preparedProduct?.name || 'Túi xách nữ',
                    price: preparedProduct?.price || 0,
                    quantity,
                    emoji: preparedProduct?.emoji || '👜',
                }],
                recipientName: recipientName,
                recipientPhone: recipientPhone,
                address: address,
                paymentMethod,
                totalPrice: (preparedProduct?.price || 0) * quantity,
                status,
            }
        });

        await allure.step('Seed order via API', async () => {
            await prepareDataService.createOrder(order);
        });
    });

    test.afterEach(async ({ prepareDataService }) => {
        await allure.step('Clean up orders via API', async () => {
            await prepareDataService.cleanupUserData(account.fullName, {});
        });
    });

    test('Test 7: Advanced - Verify order pages (seed the order via API)', { tag: '@mandatory' }, async ({ orderPage, prepareDataService, page }) => {

        await allure.step('Navigate to orders page', async () => {
            await ReportUtils.attachScreenshot('Should see the orders page', page, async () => {
                await orderPage.navigateToOrders();
            });
        });

        await allure.step('Wait for loading order state to complete', async () => {
            await orderPage.waitingForLoadingOrderStateCompleted();
        });

        await allure.step('Verify order detail information', async () => {
            await ReportUtils.attachScreenshot('Should see the Order Detail Page with correct data', page, async () => {
                await orderPage.verifyOrderDetails({
                    recipientName,
                    address,
                    status: expectedStatus,
                    totalPrice: order.totalPrice,
                });
            });
        });
    });

});
