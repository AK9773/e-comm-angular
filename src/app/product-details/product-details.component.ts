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
      this.productService.getProduct(id).subscribe((result) => {
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
      if (!localStorage.getItem('user')) {
        this.productService.localAddToCart(this.product);
        this.addCart = false;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user)[0].userId;
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
    if (!localStorage.getItem('user')) {
      this.productService.removeFromCart(id);
      this.addCart = true;
    }
    if (localStorage.getItem('user')) {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user)[0].userId;
      if (this.cartData) {
        this.productService
          .cartItemByProductId(this.cartData.productId)
          .subscribe((result) => {
            console.log(result);

            if (result && result[0].cartId) {
              this.productService
                .removeFromDBCart(result[0].cartId)
                .subscribe((result) => {
                  if (result) {
                    this.productService.CartItemList(userId);
                    this.addCart = true;
                    console.log('hello');
                  }
                });
            }
          });
      }
    }
  }
  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
  }

  loadDetails() {
    let user = localStorage.getItem('user');
    if (user) {
      let userId = JSON.parse(user)[0].userId;
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
