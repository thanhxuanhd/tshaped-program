import { APIRequestContext, APIResponse } from '@playwright/test';

export interface RequestOptions {
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean>;
    data?: any;
    timeout?: number;
}

export class ApiHelper {
    constructor(private request: APIRequestContext) {}

    /**
     * Send a GET request
     */
    async get(url: string, options?: RequestOptions): Promise<APIResponse> {
        return await this.request.get(url, {
            headers: options?.headers,
            params: options?.params,
            timeout: options?.timeout,
        });
    }

    /**
     * Send a POST request
     */
    async post(url: string, options?: RequestOptions): Promise<APIResponse> {
        return await this.request.post(url, {
            headers: options?.headers,
            params: options?.params,
            data: options?.data,
            timeout: options?.timeout,
        });
    }

    /**
     * Send a PUT request
     */
    async put(url: string, options?: RequestOptions): Promise<APIResponse> {
        return await this.request.put(url, {
            headers: options?.headers,
            params: options?.params,
            data: options?.data,
            timeout: options?.timeout,
        });
    }

    /**
     * Send a PATCH request
     */
    async patch(url: string, options?: RequestOptions): Promise<APIResponse> {
        return await this.request.patch(url, {
            headers: options?.headers,
            params: options?.params,
            data: options?.data,
            timeout: options?.timeout,
        });
    }

    /**
     * Send a DELETE request
     */
    async delete(url: string, options?: RequestOptions): Promise<APIResponse> {
        return await this.request.delete(url, {
            headers: options?.headers,
            params: options?.params,
            data: options?.data,
            timeout: options?.timeout,
        });
    }

    /**
     * Helper to get JSON response body directly
     */
    async getJson<T = any>(url: string, options?: RequestOptions): Promise<T> {
        const response = await this.get(url, options);
        return await response.json();
    }

    /**
     * Helper to post data and return JSON response directly
     */
    async postJson<T = any>(url: string, options?: RequestOptions): Promise<T> {
        const response = await this.post(url, options);
        return await response.json();
    }
}
