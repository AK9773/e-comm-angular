import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: Product[] | undefined;
  cartItems: number = 0;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.reloadHeader();
  }

  logout() {
    this.productService.logout();
    this.productService.cartData.subscribe((result) => {
      this.cartItems = result.length;
    });
    this.menuType = 'default';
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.productService.searchProduct(element.value).subscribe((result) => {
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
    this.router.navigate([`search/${val}`]);
  }

  itemDetails(productId: number) {
    this.productService.getProduct(productId).subscribe((result) => {
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
          this.menuType = 'seller';
          this.sellerName = JwtResponseObj.seller.name;
        }
        if (JwtResponseObj && JwtResponseObj.user) {
          this.menuType = 'user';
          this.userName = JwtResponseObj.user.name;
          this.productService.CartItemList(JwtResponseObj.user.userId);
        }
      }
      let cartData = localStorage.getItem('localCart');
      if (cartData) {
        this.cartItems = JSON.parse(cartData).length;
      }
      if (!cartData && !JwtResponse) {
        this.cartItems = 0;
      }
      this.productService.cartData.subscribe((result) => {
        if (result) {
          this.cartItems = result.length;
        }
      });
    });
  }
}
