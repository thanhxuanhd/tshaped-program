export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';
export type OrderPaymentMethod = 'cash' | 'card';

export interface IOrder {
    _id?: string;
    status?: OrderStatus;
    items: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        emoji: string;
    }[];
    recipientName: string;
    recipientPhone: string;
    address: string;
    paymentMethod: OrderPaymentMethod;
    paymentIntentId?: string; // Optional, only required for card payments
    totalPrice: number;
}

export interface IOrderDeleteFilter {
    search?: string;
    status?: OrderStatus;
    paymentMethod?: OrderPaymentMethod;
}

export interface OrderDetails {
    recipientName: string;
    address: string;
    status?: string;
    totalPrice: number;
}