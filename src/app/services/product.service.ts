import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Order, Product, ProductResponse } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<Cart[] | []>();
  constructor(private http: HttpClient, private router: Router) {}

  addProduct(data: FormData) {
    let headers = this.headers();
    return this.http.post('http://localhost:8080/product-api/product', data, {
      headers,
    });
  }

  productList() {
    return this.http.get<ProductResponse[]>(
      'http://localhost:8080/product-api/product'
    );
  }

  sellerProductList(sellerId: number) {
    let headers = this.headers();
    return this.http.get<ProductResponse[]>(
      'http://localhost:8080/product-api/product/sellerId=' + sellerId,
      { headers }
    );
  }

  deleteProduct(id: number) {
    let headers = this.headers();
    return this.http.delete(
      `http://localhost:8080/product-api/product/productId=${id}`,
      { headers }
    );
  }

  getProduct(id: number) {
    return this.http.get<ProductResponse>(
      `http://localhost:8080/product-api/product/productId=${id}`
    );
  }

  updateProduct(product: ProductResponse) {
    let headers = this.headers();
    return this.http.put<ProductResponse>(
      `http://localhost:8080/product-api/product/productId=${product.productId}`,
      product,
      { headers }
    );
  }

  searchProduct(query: string) {
    return this.http.get<ProductResponse[]>(
      `http://localhost:8080/product-api/product/query=${query}`
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
    this.cartData.emit(cartData);
  }

  removeFromCart(id: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: Cart[] = JSON.parse(cartData);
      let filteredItems: Cart[] = items.filter(
        (cart: Cart) => id !== cart.productId
      );
      localStorage.setItem('localCart', JSON.stringify(filteredItems));
      this.cartData.emit(filteredItems);
    }
  }

  addToCart(cartItem: Cart) {
    let headers = this.headers();
    return this.http.post<Cart>(
      'http://localhost:8080/cart-api/cart',
      cartItem,
      {
        headers,
      }
    );
  }

  cartItemByProductId(productId: number) {
    let headers = this.headers();
    return this.http.get<Cart[]>(
      'http://localhost:8080/cart-api/cart/productId=' + productId,
      { headers }
    );
  }

  CartItemList(userId: number) {
    let headers = this.headers();
    return this.http
      .get<Cart[]>('http://localhost:8080/cart-api/cart/userId=' + userId, {
        headers,
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeFromDBCart(cartId: number) {
    let headers = this.headers();
    return this.http.delete(
      'http://localhost:8080/cart-api/cart/cartId=' + cartId,
      { headers }
    );
  }

  cartItems() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.get<Cart[]>(
      'http://localhost:8080/cart-api/cart/userId=' +
        JwtResponseObj.user.userId,
      { headers }
    );
  }

  orderNow(order: Order) {
    let headers = this.headers();
    return this.http.post('http://localhost:8080/order-api/order', order, {
      headers,
    });
  }

  orderData(userId: number) {
    let headers = this.headers();
    return this.http.get<Order[]>(
      'http://localhost:8080/order-api/order/userId=' + userId,
      { headers }
    );
  }

  deleteCartItems(cartId: number) {
    let headers = this.headers();
    return this.http
      .delete('http://localhost:8080/cart-api/cart/cartId=' + cartId, {
        observe: 'response',
        headers,
      })
      .subscribe((result) => {
        this.cartData.emit([]);
      });
  }

  cancelOrder(orderId: number) {
    let headers = this.headers();
    return this.http.delete(
      'http://localhost:8080/order-api/order/' + orderId,
      { headers }
    );
  }

  headers() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return headers;
  }
}
