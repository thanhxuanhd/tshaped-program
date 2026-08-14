
import test from '../core/fixtures/all.fixture';
import { ReportUtils } from '../core';
import * as allure from 'allure-js-commons';

test.describe('Login Page Tests', () => {
    const account = {
        username: '',
        password: ''
    };

    test.beforeEach(async ({ loginPage }) => {
        await allure.step('Navigate to login page', async () => {
            await loginPage.openUrl();
        });
    });

    test('Verify login with empty credentials', async ({ loginPage }) => {
        await allure.step('Login with empty credentials', async () => {
            await loginPage.doLogin(account.username, account.password);
        });

        await allure.step('Verify login errors', async () => {
            await ReportUtils.attachScreenshot('Login Page Screenshot', loginPage.page, async () => {
                await loginPage.verifyErrorMessageShowAndText('Vui lòng nhập đầy đủ tài khoản và mật khẩu');
            });
        });
    });

    test('Verify login with invalid credentials', async ({ loginPage }) => {
        await allure.step('Login with invalid credentials', async () => {
            await loginPage.doLogin('invalid', 'invalid');
        });

        await allure.step('Verify login errors', async () => {
            await ReportUtils.attachScreenshot('Login Page Screenshot', loginPage.page, async () => {
                await loginPage.verifyErrorMessageShowAndText('Tài khoản hoặc mật khẩu không đúng');
            });
        });
    });
});