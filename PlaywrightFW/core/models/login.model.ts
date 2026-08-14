export interface ILoginModel {
    email: string;
    password: string;
}

export interface ILoginResponse {
    token: string;
    user: {
        id: string;
        username: string;
        name: string;
        role: 'customer' | 'admin';
        avatar: string;
    }; 
}