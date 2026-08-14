import {test as baseTest } from '@playwright/test';
import {pageFixtures, PageFixtures} from './page.fixture';

const test = baseTest.extend<PageFixtures>({
    ...pageFixtures
});

export default test;
export const expect = test.expect;