import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Cart, Login, Product, SignUp } from '../data-type';
import { ProductService } from '../services/product.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private productService: ProductService
  ) {}

  showLogin: boolean = true;
  isLogin: boolean = false;
  authError: string = '';
  signUpMessage: string | undefined;

  ngOnInit(): void {
    this.userService.reloadUser();
  }

  signUp(data: SignUp): void {
    this.userService.userSignUp(data).subscribe((result) => {
      if (result) {
        this.signUpMessage = 'Sign Up Successfull';
        setTimeout(() => {
          this.showLogin = true;
        }, 2000);
      } else {
        this.signUpMessage = 'Email Id already in use';
        this.showLogin = false;
      }
      setTimeout(() => {
        this.signUpMessage = undefined;
      }, 2000);
    });
  }

  login(data: Login): void {
    this.userService.userLogin(data);
    this.userService.isLogIn.subscribe((isError) => {
      if (isError) {
        this.authError = 'Email or Password is incorrect. Please Check.';
        this.isLogin = true;
      } else {
        this.localCartToRemoteCart();
      }
    });
  }

  openLogin() {
    this.showLogin = true;
  }
  openSignUp() {
    this.showLogin = false;
  }
  localCartToRemoteCart() {
    let localCartData = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId: number = user && JSON.parse(user)[0].userId;

    if (localCartData) {
      let localCartDataJSON: Product[] =
        localCartData && JSON.parse(localCartData);

      localCartDataJSON.forEach((product: Product, index) => {
        delete product.sellerId;
        let cartData: Cart = {
          ...product,
          userId,
          cartId: undefined,
        };

        this.productService.addToCart(cartData).subscribe();
        if (localCartDataJSON.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }
  }
}