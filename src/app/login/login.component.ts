import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Cart, Product, ProductResponse, User, UserLogin } from '../data-type';
import { ProductService } from '../services/product.service';
import { HeaderComponent } from '../header/header.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  userId: number | undefined;
  userLogin!: FormGroup;
  userSignUp!: FormGroup;

  ngOnInit(): void {
    this.userLogin = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.userSignUp = new FormGroup({
      userName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
    });
    this.userService.reloadUser();
  }

  signUp(): void {
    let data: User = this.userSignUp.value;
    this.userService.userSignUp(data).subscribe((result) => {
      if (result) {
        this.signUpMessage = 'Sign Up Successfull';
        setTimeout(() => {
          this.showLogin = true;
        }, 2000);
      } else {
        this.signUpMessage = 'userID already in use';
        this.showLogin = false;
      }
      setTimeout(() => {
        this.signUpMessage = undefined;
      }, 2000);
    });
  }

  login(): void {
    let data: UserLogin = this.userLogin.value;
    this.userService.userLogin(data).subscribe(
      (result) => {
        if (result) {
          let resultData: string = JSON.stringify(result);
          localStorage.setItem('JwtResponse', resultData);
          this.router.navigate(['home']);
          this.localCartToRemoteCart();
        }
      },
      (error) => {
        if (error && error.status == 401) {
          this.isLogin = true;
          this.authError = 'userId or Password is incorrect. Please Check.';
        }
      }
    );
  }

  openLogin() {
    this.showLogin = true;
  }

  openSignUp() {
    this.showLogin = false;
  }

  localCartToRemoteCart() {
    let localCartData = localStorage.getItem('localCart');

    if (localStorage.getItem('JwtResponse')) {
      this.userService.getUserId().subscribe((result) => {
        this.userId = result;
        if (localCartData) {
          let localCartDataJSON: Cart[] =
            localCartData && JSON.parse(localCartData);
          localCartDataJSON.forEach((product: Cart, index) => {
            let cartData: Cart = {
              ...product,
              userId: this.userId,
              cartId: undefined,
            };
            this.productService.addToCart(cartData).subscribe();
            if (localCartDataJSON.length === index + 1) {
              localStorage.removeItem('localCart');
            }
          });
        }
      });
    }
  }
}
