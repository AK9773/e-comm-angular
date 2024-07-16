import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';
import { UserService } from '../services/user.service';
import { SearchComponent } from '../search/search.component';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from '../services/unsubscribe.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent extends Unsubscribe implements OnInit {
  menuType!: string;
  sellerName: string = '';
  userName: string = '';
  searchResult: ProductResponse[] | undefined;
  cartItems: number = 0;

  constructor(
    private router: Router,
    private userService: UserService,
    private productService: ProductService
  ) {
    super();
  }

  ngOnInit(): void {
    this.productService.menuType.subscribe((res) => {
      this.menuType = res;
    });
    this.reloadHeader();
  }

  logout() {
    if (localStorage.getItem('JwtResponse')) {
      localStorage.removeItem('JwtResponse');
    }
    this.productService.menuType.next('default');
    this.router.navigate(['/home']);
    this.productService.cartData.next([]);
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.productService
        .searchProduct(element.value)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((result) => {
          this.searchResult = result;
          if (result.length > 5) {
            result.length = 5;
          }
        });
    }
  }

  blurSearch() {
    this.searchResult = undefined;
  }

  search(val: string) {
    this.productService.query.next(val);
    this.router.navigate([`search/${val}`]);
  }

  itemDetails(productId: number) {
    this.productService
      .getProduct(productId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.router.navigate([`details/${productId}`]);
      });
  }

  reloadHeader() {
    this.router.events.subscribe((val: any) => {
      let JwtResponse = localStorage.getItem('JwtResponse');
      let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
      if (val.url) {
        if (
          JwtResponseObj &&
          JwtResponseObj.seller &&
          val.url.includes('seller')
        ) {
          this.productService.menuType.next('seller');
          this.sellerName = JwtResponseObj.seller.name;
        }
        if (JwtResponseObj && JwtResponseObj.user) {
          this.productService.menuType.next('user');
          this.userName = JwtResponseObj.user.name;
          if (localStorage.getItem('JwtResponse')) {
            this.userService
              .getUserId()
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe((result) => {
                if (result) {
                  this.productService.CartItemList(result);
                }
              });
          }
        }
      }
      let cartData = localStorage.getItem('localCart');
      if (cartData) {
        this.cartItems = JSON.parse(cartData).length;
      }
      this.productService.cartData.subscribe((result) => {
        if (result) {
          this.cartItems = result.length;
        }
      });
    });
  }
}
