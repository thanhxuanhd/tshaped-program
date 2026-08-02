import { test } from '../fixtures/automation-practice-form.fixture';
import { IStudentRegisterData } from '../pageData';

const testCases: { desc: string; studentData: IStudentRegisterData }[] = [
    {
        desc: 'Register student with all fields successfully',
        studentData: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'example@email.com',
            gender: 'Male',
            mobileNumber: '1234567890',
            dateOfBirth: '17 Aug 2022',
            subjects: ['Maths', 'Physics'],
            hobbies: ['Reading', 'Music'],
            currentAddress: '123 Main Street',
            state: 'NCR',
            city: 'Gurgaon'
        }
    },
    {
        desc: 'Register with mandatory fields successfully',
        studentData: {
            firstName: 'John',
            lastName: 'Doe',
            gender: 'Female',
            mobileNumber: '1234567890'
        }
    }
];

for (const { desc, studentData } of testCases) {
    test(desc, async ({ automationPracticeFormPage }) => {
        await automationPracticeFormPage.navigateTo();

        await automationPracticeFormPage.fillForm(studentData);

        await automationPracticeFormPage.assertFormData(studentData);

        await automationPracticeFormPage.submitForm();

        await automationPracticeFormPage.assertFormSubmissionPopupTitle();
        await automationPracticeFormPage.assertFormDataPopup(studentData);
    });
}

