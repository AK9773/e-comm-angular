import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Cart, CartSummary, Product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: Cart[] | undefined;
  userLogin: boolean = true;
  checkoutButton: boolean = false;
  cartSummary: CartSummary = {
    amount: 0,
    tax: 0,
    discount: 0,
    delivery: 0,
    total: 0,
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  checkout() {
    this.router.navigate(['checkout']);
  }

  removeFromCart(cartId: number | undefined) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    if (JwtResponseObj && JwtResponseObj.user) {
      if (this.cartItems && cartId) {
        this.productService.removeFromDBCart(cartId).subscribe((result) => {
          if (result) {
            let userId = JwtResponseObj.user.userId;
            this.productService.CartItemList(userId);
            this.loadDetails();
          }
        });
      }
    } else {
      if (this.cartItems && cartId) {
        this.productService.removeFromCart(cartId);
        this.loadDetails();
      }
    }
  }

  loadDetails() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    if (JwtResponseObj && JwtResponseObj.user) {
      // let user = localStorage.getItem('user');
      this.productService.cartItems().subscribe((result) => {
        if (result) {
          this.cartItems = result;
          this.cartSummaryDetails();
          if (result.length === 0) {
            this.router.navigate(['/home']);
          }
        }
      });
      this.checkoutButton = true;
      this.userLogin = true;
    } else {
      let localCartData = localStorage.getItem('localCart');
      let localCartDataJson = localCartData && JSON.parse(localCartData);
      this.cartItems = localCartDataJson;
      this.cartSummaryDetails();
      this.checkoutButton = false;
      if (localCartDataJson.length === 0) {
        this.router.navigate(['/home']);
      }
      this.userLogin = false;
    }
  }

  cartSummaryDetails() {
    let price: number = 0;
    this.cartItems &&
      this.cartItems.forEach((item) => {
        if (item.quantity) {
          price = price + +item.price * item.quantity;
        }
      });
    this.cartSummary.amount = price;
    this.cartSummary.tax = price / 20;
    this.cartSummary.discount = price / 10;
    this.cartSummary.delivery = 100;
    this.cartSummary.total =
      this.cartSummary.amount +
      this.cartSummary.tax -
      this.cartSummary.discount +
      this.cartSummary.delivery;
  }

  login() {
    this.router.navigate(['/login']);
  }
}
