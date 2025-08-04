// src/types/index.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export interface CartItem {
  quantity: number;
  products: Product;
}
