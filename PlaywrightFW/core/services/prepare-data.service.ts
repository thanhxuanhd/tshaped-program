import { API_ENDPOINTS, ApiHelper } from "../api";
import type {
    ICartItem,
    ILoginResponse,
    IOrder,
    IOrderDeleteFilter,
    IProduct
} from '../models';
import type { APIRequestContext } from '@playwright/test';

export class PrepareDataService {
    private readonly apiHelper: ApiHelper;
    private apiToken = '';

    constructor(apiRequestContext: APIRequestContext) {
        this.apiHelper = new ApiHelper(apiRequestContext);
    }

    async login(username: string, password: string): Promise<ILoginResponse> {
        const response = await this.apiHelper.post(`${API_ENDPOINTS.AUTH}/login`, {
            data: { username, password },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.json();
    }

    async prepareUserData(username: string, password: string): Promise<void> {
        const loginResponse = await this.login(username, password);
        this.apiToken = loginResponse.token;
    }

    private getAuthHeaders(): Record<string, string> {
        if (!this.apiToken) {
            throw new Error('API token is missing. Call prepareUserData() before using authenticated requests.');
        }

        return {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.apiToken,
        };
    }

    async createOrder(orderData: IOrder): Promise<any> {
        const response = await this.apiHelper.post(API_ENDPOINTS.ORDERS, {
            data: orderData,
            headers: this.getAuthHeaders(),
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
            headers: this.getAuthHeaders(),
        });
        return response.json();
    }

    async getProducts(): Promise<IProduct[]> {
        const response = await this.apiHelper.get(`${API_ENDPOINTS.PRODUCTS}`, {
            headers: this.getAuthHeaders(),
        });
        return response.json();
    }

    async findProduct(productName: string): Promise<IProduct | undefined> {
        const products = await this.getProducts();
        return products.find(product => product.name === productName);
    }

    async getRandomProducts(count: number): Promise<IProduct[]> {
        const products = await this.getProducts();
        const productIds = new Set<string>();
        const uniqueProducts = products.filter(product => {
            if (productIds.has(product._id)) {
                return false;
            }

            productIds.add(product._id);
            return true;
        });
        const shuffled = [...uniqueProducts].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }

    async cleanupUserData(userFullName: string, filter?: IOrderDeleteFilter): Promise<void> {
        await this.cleanupCart([]);
        await this.cleanupOrder(filter || {});
        await this.updateUserFullName(userFullName);
    }

    async updateUserFullName(newFullName: string): Promise<any> {
        const response = await this.apiHelper.patch(`${API_ENDPOINTS.PROFILE}`, {
            data: { name: newFullName },
            headers: this.getAuthHeaders(),
        });
        return response.json();
    }

    async cleanupCart(items: ICartItem[]): Promise<any> {
        const response = await this.apiHelper.put(API_ENDPOINTS.CART, {
            data: { items },
            headers: this.getAuthHeaders(),
        });
        return response.json();
    }
}
