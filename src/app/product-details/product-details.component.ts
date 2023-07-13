import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Cart, Product } from '../data-type';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  quantityProduct: number = 1;
  addCart: boolean = true;
  cartData: Product | undefined;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    id &&
      this.productService.getProduct(+id).subscribe((result) => {
        this.product = result;

        let cartData = localStorage.getItem('localCart');
        if (id && cartData) {
          let items = JSON.parse(cartData).filter(
            (product: Product) => product.productId.toString() === id
          );
          if (items.length !== 0) {
            this.addCart = false;
          } else {
            this.addCart = true;
          }
        }
      });
    this.loadDetails();
  }

  quantity(val: string) {
    if (val === 'min' && this.quantityProduct > 0) {
      this.quantityProduct = this.quantityProduct - 1;
    }
    if (val === 'plus') {
      this.quantityProduct = this.quantityProduct + 1;
    }
  }
  addToCart() {
    if (this.product) {
      this.product.quantity = this.quantityProduct;
      if (!localStorage.getItem('JwtResponse')) {
        this.productService.localAddToCart(this.product);
        this.addCart = false;
      } else {
        let JwtResponse = localStorage.getItem('JwtResponse');
        let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
        let userId = JwtResponseObj.user.userId;
        let cartData: Cart = {
          ...this.product,
          productId: this.product.productId,
          userId: userId,
          cartId: undefined,
        };
        this.productService.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.productService.CartItemList(userId);
            this.addCart = false;
          }
        });
      }
    }
  }
  removeFromCart(id: number) {
    if (!localStorage.getItem('JwtResponse')) {
      this.productService.removeFromCart(id);
      this.addCart = true;
    }
    if (localStorage.getItem('JwtResponse')) {
      let JwtResponse = localStorage.getItem('JwtResponse');
      let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
      let userId = JwtResponseObj.user.userId;
      if (this.cartData) {
        this.productService
          .cartItemByProductId(this.cartData.productId)
          .subscribe((result) => {
            if (result && result[0].cartId) {
              this.productService
                .removeFromDBCart(result[0].cartId)
                .subscribe((result) => {
                  if (result) {
                    this.productService.CartItemList(userId);
                    this.addCart = true;
                  }
                });
            }
          });
      }
    }
  }

  buyNow() {
    if (localStorage.getItem('JwtResponse')) {
      let productId = this.product && this.product.productId;
      if (productId) {
        this.productService
          .cartItemByProductId(productId)
          .subscribe((result) => {
            if (result.length == 0) {
              this.addToCart();
            }
            this.router.navigate(['/checkout']);
          });
      }
    } else if (localStorage.getItem('localCart')) {
      let localCart = localStorage.getItem('localCart');
      let localCartObj = localCart && JSON.parse(localCart);
      let available: boolean = true;
      if (localCartObj && this.product) {
        for (let index = 0; index < localCartObj.length; index++) {
          if (localCartObj[index].productId == this.product.productId) {
            available = false;
            break;
          }
        }
        if (available) {
          this.addToCart();
        }
      }
      this.router.navigate(['/login']);
    } else {
      this.addToCart();
      this.router.navigate(['/login']);
    }
  }

  loadDetails() {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    if (JwtResponseObj && JwtResponseObj.user) {
      let userId = JwtResponseObj.user.userId;
      this.productService.CartItemList(userId);
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      this.productService.cartData.subscribe((result) => {
        let item: Product[] = result.filter(
          (product: Product) => id?.toString() === product.productId?.toString()
        );
        if (item.length) {
          this.addCart = false;
          this.cartData = item[0];
        }
      });
    }
  }
}
