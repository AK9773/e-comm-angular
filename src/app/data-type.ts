export interface Seller {
  sellerId: undefined | number;
  name: string;
  password: string;
  sellerName: string;
}
export interface User {
  userId: undefined | number;
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

export interface Product {
  productName: string;
  price: string;
  color: string;
  category: string;
  image: string;
  description: string;
  quantity: undefined | number;
  productId: number;
  sellerId: number | undefined;
}

export interface Cart {
  productName: string;
  price: string;
  color: string;
  category: string;
  image: string;
  description: string;
  quantity: undefined | number;
  productId: number;
  cartId: number | undefined;
  userId: number;
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
