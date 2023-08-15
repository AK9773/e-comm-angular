import { Component, OnInit } from '@angular/core';
import { Cart, CartSummary, Order } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartSummary: CartSummary = {
    amount: 0,
    tax: 0,
    discount: 0,
    delivery: 0,
    total: 0,
  };
  cartData: Cart[] | undefined;
  userId: number | undefined;

  checkoutForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      mobile: new FormControl<string>('', [Validators.required]),
      address: new FormControl<string>('', [Validators.required]),
    });
    if (localStorage.getItem('JwtResponse')) {
      this.userService.getUserId().subscribe((result) => {
        this.userId = result;
      });
    }
    let JwtResponseObj = this.productService.getJwtResponseObj();
    if (JwtResponseObj && JwtResponseObj.user) {
      this.productService.cartItems().subscribe((result) => {
        if (result) {
          this.cartData = result;
          this.cartSumaryDetails();
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  orderNow() {
    let data = this.checkoutForm.value;
    if (this.userId) {
      if (this.checkoutForm.value.address) {
        let order: Order = {
          ...data,
          userId: this.userId,
          totalPrice: this.cartSummary.total,
          orderId: undefined,
        };
        this.cartData?.forEach((item) => {
          setTimeout(() => {
            item.cartId && this.productService.deleteCartItems(item.cartId);
          }, 600);
        });
        this.productService.orderNow(order).subscribe((result) => {
          this.router.navigate(['my-order']);
        });
      }
    }
  }

  cartSumaryDetails() {
    let price: number = 0;
    this.cartData &&
      this.cartData.forEach((item) => {
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
}
