import { Locator, type Page, expect } from "@playwright/test";
import { IStudentRegisterData } from "../pageData";

export class AutomationPracticeFormPage {

    private firstNameLocator: Locator;
    private lastNameLocator: Locator;
    private emailLocator: Locator;
    private genderMaleLocator: Locator;
    private genderFemaleLocator: Locator;
    private genderOtherLocator: Locator;
    private mobileNumberLocator: Locator;
    private dateOfBirthInputLocator: Locator;
    private subjectsInputLocator: Locator;
    private hobbiesCheckboxLocator: Locator;
    private pictureUploadInputLocator: Locator;
    private currentAddressTextareaLocator: Locator;
    private stateDropdownLocator: Locator;
    private cityDropdownLocator: Locator;
    private submitButtonLocator: Locator;
    private formSubmissionPopupLocator: Locator;
    private subjectsContainerLocator: Locator;
    private stateContainerLocator: Locator;
    private cityContainerLocator: Locator;

    constructor(private readonly page: Page) {
        this.firstNameLocator = page.locator('input#firstName');
        this.lastNameLocator = page.locator('input#lastName');
        this.emailLocator = page.locator('input#userEmail');
        this.genderMaleLocator = page.getByRole('radio', { name: 'Male', exact: true });
        this.genderFemaleLocator = page.getByRole('radio', { name: 'Female', exact: true });
        this.genderOtherLocator = page.getByRole('radio', { name: 'Other', exact: true });
        this.mobileNumberLocator = page.locator('input#userNumber');
        this.dateOfBirthInputLocator = page.locator('input#dateOfBirthInput');
        this.subjectsInputLocator = page.locator('div#subjectsContainer input[type="text"]');
        this.hobbiesCheckboxLocator = page.locator('input[type="checkbox"]');
        this.pictureUploadInputLocator = page.locator('input#uploadPicture');
        this.currentAddressTextareaLocator = page.locator('textarea#currentAddress');
        this.stateDropdownLocator = page.locator('div#state input[role="combobox"]');
        this.cityDropdownLocator = page.locator('div#city input[role="combobox"]');
        this.submitButtonLocator = page.locator('form#userForm button#submit');
        this.formSubmissionPopupLocator = page.locator('[aria-labelledby="example-modal-sizes-title-lg"]');
        this.subjectsContainerLocator = page.locator('div#subjectsContainer');
        this.stateContainerLocator = page.locator('div#state');
        this.cityContainerLocator = page.locator('div#city');
    }

    async navigateTo() {
        await this.page.goto('https://demoqa.com/automation-practice-form');
    }

    async fillForm(studentData: IStudentRegisterData) {
        await this.firstNameLocator.fill(studentData.firstName);
        await this.lastNameLocator.fill(studentData.lastName);
        await this.emailLocator.fill(studentData.email ?? '');

        switch (studentData.gender) {
            case 'Male':
                await this.genderMaleLocator.check();
                break;
            case 'Female':
                await this.genderFemaleLocator.check();
                break;
            case 'Other':
                await this.genderOtherLocator.check();
                break;
            default:
                break;
        }

        await this.mobileNumberLocator.fill(studentData.mobileNumber);

        if (studentData.dateOfBirth) {
            await this.dateOfBirthInputLocator.fill(studentData.dateOfBirth, { timeout: 1000 }); // Format date as DD/MM/YYYY
        }

        if (studentData.subjects && studentData.subjects.length > 0) {
            await this.subjectsInputLocator.click();
            for (const subject of studentData.subjects) {
                await this.subjectsInputLocator.fill(subject);
                await this.subjectsInputLocator.press('Tab');
            }
        }

        if (studentData.hobbies && studentData.hobbies.length > 0) {
            for (const hobby of studentData.hobbies) {
                await this.hobbiesCheckboxLocator.locator(`+ label:has-text("${hobby}")`).check();
            }
        }

        await this.currentAddressTextareaLocator.fill(studentData.currentAddress ?? '');

        if (studentData.state) {
            await this.stateDropdownLocator.fill(studentData.state ?? '', { timeout: 1000 });
            await this.stateDropdownLocator.press('Tab');
        }

        if (studentData.city) {
            await this.cityDropdownLocator.fill(studentData.city ?? '', { timeout: 1000 });
            await this.cityDropdownLocator.press('Tab');
        }

    }

    async submitForm() {
        await this.submitButtonLocator.click();
    }

    async assertFormSubmissionPopupTitle() {
        const popupTitleLocator = this.formSubmissionPopupLocator.locator('#example-modal-sizes-title-lg');
         expect(await popupTitleLocator.textContent()).toBe('Thanks for submitting the form');
    }

    async assertFormDataPopup(studentData: IStudentRegisterData) {
        const popupTableBodyLocator = this.formSubmissionPopupLocator.locator('table tbody');

        const assertRowValue = async (label: string, expectedValue: string) => {
            const row = popupTableBodyLocator.locator('tr').filter({ hasText: label });
            await expect(row.locator('td').nth(1)).toHaveText(expectedValue);
        };

        await assertRowValue('Student Name', `${studentData.firstName} ${studentData.lastName}`);
        await assertRowValue('Gender', studentData.gender);
        await assertRowValue('Mobile', studentData.mobileNumber);

        if (studentData.email) {
            await assertRowValue('Student Email', studentData.email);
        }

        if (studentData.subjects && studentData.subjects.length > 0) {
            await assertRowValue('Subjects', studentData.subjects.join(', '));
        }

        if (studentData.hobbies && studentData.hobbies.length > 0) {
            await assertRowValue('Hobbies', studentData.hobbies.join(', '));
        }

        if (studentData.picture && studentData.picture.split('/').pop()) {
            const filename = studentData.picture.split('/').pop() || '';
            await assertRowValue('Picture', filename);
        }

        if (studentData.currentAddress) {
            await assertRowValue('Address', studentData.currentAddress);
        }

        if (studentData.state && studentData.city) {
            await assertRowValue('State and City', `${studentData.state} ${studentData.city}`);
        }
    }

    async assertFormData(studentData: IStudentRegisterData) {

        expect(await this.firstNameLocator.inputValue()).toBe(studentData.firstName);
        expect(await this.lastNameLocator.inputValue()).toBe(studentData.lastName);

        if (studentData.email) {
            expect(await this.emailLocator.inputValue()).toBe(studentData.email);
        }

        expect(await this.mobileNumberLocator.inputValue()).toBe(studentData.mobileNumber);
        if (studentData.dateOfBirth) {
            expect(await this.dateOfBirthInputLocator.inputValue()).toBe(studentData.dateOfBirth);
        }

        if (studentData.subjects) {
            for (const subject of studentData.subjects) {
                await expect(this.subjectsContainerLocator.getByText(subject)).toBeVisible();
            }
        }

        if (studentData.hobbies) {
            for (const hobby of studentData.hobbies) {
                await expect(this.hobbiesCheckboxLocator.locator(`+ label:has-text("${hobby}")`)).toBeChecked();
            }
        }
        
        if(studentData.currentAddress) {
            expect(await this.currentAddressTextareaLocator.inputValue()).toBe(studentData.currentAddress);
        }

        if (studentData.state) {
            await expect(this.stateContainerLocator.getByText(studentData.state, { exact: true })).toBeVisible();
        }

        if (studentData.city) {
            await expect(this.cityContainerLocator.getByText(studentData.city, { exact: true })).toBeVisible();
        }
    }
}