import { Component } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { Seller, SellerLogin } from '../data-type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Unsubscribe } from '../services/unsubscribe.class';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent extends Unsubscribe {
  showLogin: boolean = true;
  isLogin: boolean = false;
  authError: string = '';
  signUpMessage: string | undefined;
  sellerSignUp!: FormGroup;
  sellerLogin!: FormGroup;

  constructor(private sellerService: SellerService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.sellerLogin = new FormGroup({
      sellerName: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
    this.sellerSignUp = new FormGroup({
      sellerName: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      name: new FormControl('', Validators.required),
    });
    this.sellerService.reloadSeller();
  }

  signUp(): void {
    let data: Seller = this.sellerSignUp.value;
    this.sellerService
      .sellerSignUp(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
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

  login(): void {
    let data: SellerLogin = this.sellerLogin.value;
    this.sellerService
      .sellerLogin(data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
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
