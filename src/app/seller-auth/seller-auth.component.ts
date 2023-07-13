import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { Seller, SellerLogin } from '../data-type';

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

  signUp(data: Seller): void {
    this.sellerService.sellerSignUp(data).subscribe((result) => {
      if (result) {
        this.signUpMessage = 'Sign Up Successfull';
        setTimeout(() => {
          this.showLogin = true;
        }, 2000);
      } else {
        this.signUpMessage = 'Seller ID already used';
        this.showLogin = false;
      }
      setTimeout(() => {
        this.signUpMessage = undefined;
      }, 2000);
    });
  }

  login(data: SellerLogin): void {
    this.sellerService.sellerLogin(data).subscribe(
      (result) => {
        if (result) {
          let resultData = JSON.stringify(result);
          localStorage.setItem('JwtResponse', resultData);
          this.router.navigate(['seller-home']);
        }
      },
      (error) => {
        if (error && error.status == 401) {
          this.isLogin = true;
          this.authError = 'sellerId or Password is incorrect. Please Check.';
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
}
