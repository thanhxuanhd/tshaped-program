import { test } from '../fixtures/automation-practice-form.fixture';
import { studentTestCases } from '../pageData';

for (const { desc, studentData } of studentTestCases) {
    test(desc, async ({ automationPracticeFormPage }) => {
        await automationPracticeFormPage.navigateTo();

        await automationPracticeFormPage.fillForm(studentData);

        await automationPracticeFormPage.assertFormData(studentData);

        await automationPracticeFormPage.submitForm();

        await automationPracticeFormPage.assertFormSubmissionPopupTitle();
        await automationPracticeFormPage.assertFormDataPopup(studentData);
    });
}
