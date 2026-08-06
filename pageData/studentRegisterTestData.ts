import { IStudentRegisterData } from './studentRegisterData';

export interface IStudentTestCase {
    desc: string;
    studentData: IStudentRegisterData;
}

export const studentTestCases: IStudentTestCase[] = [
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
