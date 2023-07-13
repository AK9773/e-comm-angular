import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SellerService } from './services/seller.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private sellerService: SellerService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    if (JwtResponseObj.seller) {
      return true;
    }
    return this.sellerService.isSellerLoggedIn;
  }
}
