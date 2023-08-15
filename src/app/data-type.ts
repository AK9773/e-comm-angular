import { SafeUrl } from '@angular/platform-browser';

export interface Seller {
  sellerId?: number;
  name: string;
  password: string;
  sellerName: string;
}
export interface User {
  userId?: number;
  name: string;
  password: string;
  userName: string;
}

export interface UserLogin {
  userName: string;
  password: string;
}

export interface SellerLogin {
  sellerName: string;
  password: string;
}

export interface JwtResponse {
  user: User | Seller;
  jwtToken: string;
}

export interface Cart {
  productName: string;
  price: string;
  color: string;
  category: string;
  imageName: string;
  description: string;
  quantity: undefined | number;
  productId: number;
  cartId: number | undefined;
  userId?: number | undefined;
}

export interface CartSummary {
  amount: number;
  tax: number;
  discount: number;
  delivery: number;
  total: number;
}

export interface Order {
  address: string;
  mobile: string;
  email: string;
  userId: number;
  totalPrice: number;
  orderId: number | undefined;
}

export interface FileHandle {
  file: File;
}

export interface Image {
  imageId: number;
  imageName: string;
  type: string;
  imageBytes: string;
}

export interface Product {
  productId: number;
  productName: string;
  price: string;
  color: string;
  category: string;
  productImages: FileHandle[];
  description: string;
  quantity: undefined | number;
  sellerId: number | undefined;
}
export interface ProductResponse {
  productId: number;
  productName: string;
  price: string;
  color: string;
  category: string;
  productImages: Image[];
  description: string;
  quantity: undefined | number;
  sellerId: number;
}
