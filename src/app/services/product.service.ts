import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Order, Product, ProductResponse } from '../data-type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new BehaviorSubject<Cart[] | []>([]);
  menuType = new BehaviorSubject<string>('default');
  query = new BehaviorSubject<string>('');
  baseURL: string = 'http://localhost:8080';

  constructor(private http: HttpClient, private router: Router) {}

  addProduct(data: FormData) {
    return this.http.post(`${this.baseURL}/product-api/product`, data);
  }

  productList() {
    return this.http.get<ProductResponse[]>(
      `${this.baseURL}/product-api/product`
    );
  }

  sellerProductList(sellerId: number) {
    return this.http.get<ProductResponse[]>(
      `${this.baseURL}/product-api/product/sellerId=${sellerId}`
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(
      `${this.baseURL}/product-api/product/productId=${id}`
    );
  }

  getProduct(id: number) {
    return this.http.get<ProductResponse>(
      `${this.baseURL}/product-api/product/productId=${id}`
    );
  }

  updateProduct(product: ProductResponse) {
    return this.http.put<ProductResponse>(
      `${this.baseURL}/product-api/product/productId=${product.productId}`,
      product
    );
  }

  searchProduct(query: string) {
    return this.http.get<ProductResponse[]>(
      `${this.baseURL}/product-api/product/query=${query}`
    );
  }

  localAddToCart(data: Cart) {
    let cartData = [];
    let localCartData = localStorage.getItem('localCart');
    if (!localCartData) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      cartData.push(data);
    } else {
      cartData = JSON.parse(localCartData);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
    }
    this.cartData.next(cartData);
  }

  removeFromCart(id: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: Cart[] = JSON.parse(cartData);
      let filteredItems: Cart[] = items.filter(
        (cart: Cart) => id !== cart.productId
      );
      localStorage.setItem('localCart', JSON.stringify(filteredItems));
      this.cartData.next(filteredItems);
    }
  }

  addToCart(cartItem: Cart) {
    return this.http.post<Cart>(`${this.baseURL}/cart-api/cart`, cartItem);
  }

  cartItemByProductId(productId: number) {
    return this.http.get<Cart[]>(
      `${this.baseURL}/cart-api/cart/productId=${productId}`
    );
  }

  CartItemList(userId: number) {
    return this.http
      .get<Cart[]>(`${this.baseURL}/cart-api/cart/userId=${userId}`, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.next(result.body);
        }
      });
  }

  removeFromDBCart(cartId: number) {
    return this.http.delete(`${this.baseURL}/cart-api/cart/cartId=${cartId}`);
  }

  cartItems() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    return this.http.get<Cart[]>(
      `${this.baseURL}/cart-api/cart/userId=${JwtResponseObj.user.userId}`
    );
  }

  orderNow(order: Order) {
    return this.http.post(`${this.baseURL}/order-api/order`, order);
  }

  orderData(userId: number) {
    return this.http.get<Order[]>(
      `${this.baseURL}/order-api/order/userId=${userId}`
    );
  }

  deleteCartItems(cartId: number) {
    return this.http
      .delete(`${this.baseURL}/cart-api/cart/cartId=${cartId}`, {
        observe: 'response',
      })
      .subscribe((result) => {
        this.cartData.next([]);
      });
  }

  cancelOrder(orderId: number) {
    return this.http.delete(`${this.baseURL}/order-api/order/${orderId}`);
  }

  getJwtResponseObj() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    return JwtResponseObj;
  }
}
