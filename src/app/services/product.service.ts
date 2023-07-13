import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Cart, Order, Product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<Product[] | []>();
  constructor(private http: HttpClient, private router: Router) {}

  addProduct(data: Product) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.post('http://localhost:8080/product-api/product', data, {
      headers,
    });
  }

  productList() {
    return this.http.get<Product[]>(
      'http://localhost:8080/product-api/product'
    );
  }

  sellerProductList(sellerId: number) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.get<Product[]>(
      'http://localhost:8080/product-api/product/sellerId=' + sellerId,
      { headers }
    );
  }

  deleteProduct(id: number) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.delete(
      `http://localhost:8080/product-api/product/productId=${id}`,
      { headers }
    );
  }

  getProduct(id: number) {
    return this.http.get<Product>(
      `http://localhost:8080/product-api/product/productId=${id}`
    );
  }

  updateProduct(product: Product) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.put<Product>(
      `http://localhost:8080/product-api/product/productId=${product.productId}`,
      product,
      { headers }
    );
  }

  searchProduct(query: string) {
    return this.http.get<Product[]>(
      `http://localhost:8080/product-api/product/query=${query}`
    );
  }

  localAddToCart(data: Product) {
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
      let items: Product[] = JSON.parse(cartData);
      let filteredItems: Product[] = items.filter(
        (product: Product) => id !== product.productId
      );
      localStorage.setItem('localCart', JSON.stringify(filteredItems));
      this.cartData.emit(filteredItems);
    }
  }

  addToCart(cartItem: Cart) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.post('http://localhost:8080/cart-api/cart', cartItem, {
      headers,
    });
  }

  cartItemByProductId(productId: number) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.get<Cart[]>(
      'http://localhost:8080/cart-api/cart/productId=' + productId,
      { headers }
    );
  }

  CartItemList(userId: number) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http
      .get<Product[]>('http://localhost:8080/cart-api/cart/userId=' + userId, {
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
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
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
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.post('http://localhost:8080/order-api/order', order, {
      headers,
    });
  }

  orderData(userId: number) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.get<Order[]>(
      'http://localhost:8080/order-api/order/userId=' + userId,
      { headers }
    );
  }

  deleteCartItems(cartId: number) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
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
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${JwtResponseObj.jwtToken}`
    );
    return this.http.delete(
      'http://localhost:8080/order-api/order/' + orderId,
      { headers }
    );
  }

  logout() {
    if (localStorage.getItem('JwtResponse')) {
      localStorage.removeItem('JwtResponse');
    }
    this.router.navigate(['/home']);
    this.cartData.emit([]);
  }
}
