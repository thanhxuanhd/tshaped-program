/**
 * [
  {
    "_id": "65f0a1b2c3d4e5f678901234",
    "name": "Phở",
    "price": 45000,
    "emoji": "🍜",
    "tag": "best-seller",
    "category": "food",
    "stock": 20
  }
]
 ***/
export interface IProduct {
    _id: string;
    name: string;
    price: number;
    emoji: string;
    tag: string;
    category: string;
    stock: number;
}