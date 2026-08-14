export interface IOrder {
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
    paymentMethod: 'cash' | 'card';
    paymentIntentId?: string; // Optional, only required for card payments
    totalPrice: number;
}