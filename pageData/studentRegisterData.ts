export interface IStudentRegisterData {
    firstName: string;
    lastName: string;
    email?: string;
    gender: string;
    mobileNumber: string;
    dateOfBirth?: string;
    subjects?: string[];
    hobbies?: string[];
    picture?: string;
    currentAddress?: string;
    state?: string;
    city?: string;
}