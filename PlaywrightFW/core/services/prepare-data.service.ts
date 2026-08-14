import { API_ENDPOINTS, ApiHelper } from "../api";
import type { ILoginResponse, IOrder, IProduct } from '../models';
import type { APIRequestContext } from '@playwright/test';

export class PrepareDataService {
    private readonly apiHelper: ApiHelper;
    private apiToken = '';
    private userId = '';
    private userFullName = '';

    constructor(apiRequestContext: APIRequestContext) {
        this.apiHelper = new ApiHelper(apiRequestContext);
    }

    async login(username: string, password: string): Promise<ILoginResponse> {
        const response = await this.apiHelper.post(`${API_ENDPOINTS.AUTH}/login`, {
            data: { username, password },
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.json();
    }

    async prepareUserData(username: string, password: string): Promise<void> {
        const loginResponse = await this.login(username, password);
        this.apiToken = loginResponse.token;
        this.userId = loginResponse.user.id;
        this.userFullName = loginResponse.user.name;
    }

    async createOrder(orderData: IOrder, token: string): Promise<any> {
        const response = await this.apiHelper.post(API_ENDPOINTS.ORDERS, {
            data: orderData,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.json();
    }

    async getProducts(token: string): Promise<IProduct[]> {
        const response = await this.apiHelper.get(`${API_ENDPOINTS.PRODUCTS}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.json(); 
    }

    async findProduct(productName: string): Promise<IProduct | undefined> {
        const products = await this.getProducts(this.apiToken);
        return products.find(product => product.name === productName);
    }

    async cleanupUserData(): Promise<void> {
        await this.updateUserFullName(this.apiToken, this.userFullName, this.userId);
    }

    async updateUserFullName(token: string, newFullName: string, userId: string): Promise<any> {
        const response = await this.apiHelper.patch(`${API_ENDPOINTS.USERS}/${userId}`, {
            data: { name: newFullName },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        });
        return response.json();
    }
}