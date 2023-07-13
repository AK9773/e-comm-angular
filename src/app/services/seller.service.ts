import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtResponse, Seller, SellerLogin } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

  sellerSignUp(data: Seller) {
    return this.http.post('http://localhost:8080/seller-api/seller', data);
  }

  reloadSeller() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    if (JwtResponseObj && JwtResponseObj.seller) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  sellerLogin(data: SellerLogin) {
    return this.http.post<JwtResponse>(
      'http://localhost:8080/authenticate/seller',
      data
    );
  }
}
