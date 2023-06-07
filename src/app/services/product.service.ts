import { HttpClient } from '@angular/common/http';
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
    return this.http.post('http://localhost:8080/product-api/product', data);
  }

  productList() {
    return this.http.get<Product[]>(
      'http://localhost:8080/product-api/product'
    );
  }

  sellerProductList(sellerId: number) {
    return this.http.get<Product[]>(
      'http://localhost:8080/product-api/product/sellerId=' + sellerId
    );
  }

  deleteProduct(id: number) {
    return this.http.delete(
      `http://localhost:8080/product-api/product/productId=${id}`
    );
  }
  getProduct(id: string) {
    return this.http.get<Product>(
      `http://localhost:8080/product-api/product/productId=${id}`
    );
  }
  updateProduct(product: Product) {
    return this.http.put<Product>(
      `http://localhost:8080/product-api/product/productId=${product.productId}`,
      product
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
    return this.http.post('http://localhost:8080/cart-api/cart', cartItem);
  }

  cartItemByProductId(productId: number) {
    return this.http.get<Cart[]>(
      'http://localhost:8080/cart-api/cart/productId=' + productId
    );
  }

  CartItemList(userId: number) {
    return this.http
      .get<Product[]>('http://localhost:8080/cart-api/cart/userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }

  removeFromDBCart(cartId: number) {
    return this.http.delete(
      'http://localhost:8080/cart-api/cart/cartId=' + cartId
    );
  }

  cartItems() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore)[0];
    return this.http.get<Cart[]>(
      'http://localhost:8080/cart-api/cart/userId=' + userData.userId
    );
  }
  orderNow(order: Order) {
    return this.http.post('http://localhost:8080/order-api/order', order);
  }

  orderData(userId: number) {
    return this.http.get<Order[]>(
      'http://localhost:8080/order-api/order/userId=' + userId
    );
  }
  deleteCartItems(cartId: number) {
    return this.http
      .delete('http://localhost:8080/cart-api/cart/cartId=' + cartId, {
        observe: 'response',
      })
      .subscribe((result) => {
        this.cartData.emit([]);
      });
  }
  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:8080/order-api/order/' + orderId);
  }
}
