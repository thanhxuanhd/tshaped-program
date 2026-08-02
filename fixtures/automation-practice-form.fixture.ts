import { test as base } from '@playwright/test';
import { AutomationPracticeFormPage } from '../pages';

export type AutomationPracticeFormFixture = {
    automationPracticeFormPage: AutomationPracticeFormPage;
}

export const test = base.extend<AutomationPracticeFormFixture>({

    automationPracticeFormPage: async ({ page }, use) => {
        const automationPracticeFormPage = new AutomationPracticeFormPage(page);

        await use(automationPracticeFormPage);
    }

});