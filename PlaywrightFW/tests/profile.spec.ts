import test, { expect } from '../core/fixtures/all.fixture';
import { ReportUtils } from '../core';
import * as allure from 'allure-js-commons';
import accounts from '../resources/account.json';
import testData from '../resources/test-data.json';

test.describe('Profile Page Tests', () => {
    const account = accounts.find(acc => acc.role === 'customer') ?? { username: '', password: '', fullName: '' };

    test.beforeEach(async ({ loginPage, prepareDataService }) => {
        await allure.step('Navigate to login page', async () => {
            await loginPage.openUrl();
        });

        await allure.step('Prepare user data via API', async () => {
            await prepareDataService.prepareUserData(account.username, account.password);
        });

        await allure.step('Perform login', async () => {
            await loginPage.doLogin(account.username, account.password);
        });
    });

    test.afterEach(async ({ prepareDataService }) => {
        await allure.step('Clean up profile via API', async () => {
            await prepareDataService.cleanupUserData(account.fullName);
        });
    });

    test('Test 6: Update Full Name Then Clean Up via API', { tag: '@mandatory' }, async ({ profilePage, page }) => {
        const updatedFullName = testData.profile.updatedFullName;

        await allure.step('Navigate to profile page', async () => {
            await ReportUtils.attachScreenshot('Should see the Profile Page', page, async () => {
                await profilePage.openProfilePage();
            });
        });

        await allure.step('Update full name', async () => {
            await profilePage.updateFullName(updatedFullName);
        });

        await allure.step('Save changes', async () => {
            await profilePage.saveChanges();
        });

        await allure.step('Verify profile update success', async () => {
            await ReportUtils.attachScreenshot('Profile Update Success Screenshot', page, async () => {
                await profilePage.verifyProfileUpdated(updatedFullName);
            });
        });

        await allure.step('Verify updated full name persists after reload', async () => {
            await profilePage.openProfilePage();
            expect(await profilePage.getFullName()).toBe(updatedFullName);
        });
    });
});