export interface SignUp {
  name: string;
  password: string;
  email: string;
}

export interface Login {
  email: string;
  password: string;
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
