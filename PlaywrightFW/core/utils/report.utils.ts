import { Page } from "@playwright/test";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";

export class ReportUtils {
    static async attachScreenshot(title: string, page: Page, fn: () => Promise<void>) {
        await page.waitForLoadState();
        const beforeScreenshot = await page.screenshot();
        await allure.attachment(title, beforeScreenshot, ContentType.JPEG);
        await fn();
        const afterScreenshot = await page.screenshot();
        await allure.attachment(title, afterScreenshot, ContentType.JPEG);
    }
}