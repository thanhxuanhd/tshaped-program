import { API_ENDPOINTS, ApiHelper } from "../api";
import type { ICartItem, ILoginResponse, IOrder, IOrderDeleteFilter, IProduct } from '../models';
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

    async createOrder(orderData: IOrder): Promise<any> {
        const response = await this.apiHelper.post(API_ENDPOINTS.ORDERS, {
            data: orderData,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`,
            }
        });
        return response.json();
    }

    async cleanupOrder(filter: IOrderDeleteFilter): Promise<any> {
        const response = await this.apiHelper.delete(API_ENDPOINTS.ORDERS, {
            params: {
                ...(filter.search && { search: filter.search }),
                ...(filter.status && { status: filter.status }),
                ...(filter.paymentMethod && { paymentMethod: filter.paymentMethod }),
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`,
            }
        });
        return response.json();
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.apiHelper.get(`${API_ENDPOINTS.PRODUCTS}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`,
            }
        });
        return response.json();
    }

    async findProduct(productName: string): Promise<IProduct | undefined> {
        const products = await this.getProducts();
        return products.find(product => product.name === productName);
    }

    async cleanupUserData(filter?: IOrderDeleteFilter): Promise<void> {
        await this.cleanupCart([]);
        await this.cleanupOrder(filter || {});
        await this.updateUserFullName(this.userFullName, this.userId);
    }

    async updateUserFullName(newFullName: string, userId: string): Promise<any> {
        const response = await this.apiHelper.patch(`${API_ENDPOINTS.PROFILE}`, {
            data: { name: newFullName },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`,
            }
        });
        return response.json();
    }

    async cleanupCart(items: ICartItem[]): Promise<any> {
        const response = await this.apiHelper.put(API_ENDPOINTS.CART, {
            data: { items },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.apiToken}`,
            }
        });
        return response.json();
    }
}