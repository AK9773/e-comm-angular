import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { Login, SignUp } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent {
  constructor(private sellerService: SellerService, private router: Router) {}

  showLogin: boolean = true;
  isLogin: boolean = false;
  authError: string = '';
  signUpMessage: string | undefined;

  ngOnInit(): void {
    this.sellerService.reloadSeller();
  }

  signUp(data: SignUp): void {
    this.sellerService.sellerSignUp(data).subscribe((result) => {
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
    this.sellerService.sellerLogin(data);
    this.sellerService.isLogIn.subscribe((isError) => {
      if (isError) {
        this.authError = 'Email or Password is incorrect. Please Check.';
        this.isLogin = true;
      }
    });
  }

  openLogin() {
    this.showLogin = true;
  }
  openSignUp() {
    this.showLogin = false;
  }
}
