import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Cart, Image, Product, ProductResponse } from '../data-type';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: ProductResponse | undefined;
  quantityProduct: number = 1;
  addCart: boolean = true;
  cartData: Cart | undefined;
  productImage: Image[] = [];
  index: number = 0;
  length: number = 0;
  userId: number | undefined;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (localStorage.getItem('JwtResponse')) {
      this.userService.getUserId().subscribe((result) => {
        this.userId = result;
        this.loadDetails();
      });
    }
    let id = this.activatedRoute.snapshot.paramMap.get('id');

    id &&
      this.productService.getProduct(+id).subscribe((result) => {
        this.product = result;
        this.length = result.productImages.length;
        this.productImage = result.productImages;

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
  }

  left() {
    if (this.index > 0) {
      this.index = this.index - 1;
    } else {
      this.index = this.length - 1;
    }
  }
  right() {
    if (this.index < this.length - 1) {
      this.index = this.index + 1;
    } else {
      this.index = 0;
    }
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
      let cartData: Cart = {
        productName: this.product.productName,
        price: this.product.price,
        color: this.product.color,
        category: this.product.category,
        description: this.product.description,
        quantity: this.product.quantity,
        productId: this.product.productId,
        cartId: undefined,
        imageName: this.product.productImages[0].imageName,
      };
      if (!localStorage.getItem('JwtResponse')) {
        this.productService.localAddToCart(cartData);
        this.addCart = false;
      } else {
        let cart: Cart = {
          ...cartData,
          userId: this.userId,
        };
        this.productService.addToCart(cart).subscribe((result) => {
          if (result && this.userId) {
            this.productService.CartItemList(this.userId);
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
      if (this.cartData) {
        this.productService
          .cartItemByProductId(this.cartData.productId)
          .subscribe((result) => {
            if (result && result[0].cartId) {
              this.productService
                .removeFromDBCart(result[0].cartId)
                .subscribe((result) => {
                  if (result && this.userId) {
                    this.productService.CartItemList(this.userId);
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
    if (this.userId) {
      this.productService.CartItemList(this.userId);
      let id = this.activatedRoute.snapshot.paramMap.get('id');
      this.productService.cartData.subscribe((result) => {
        let item: Cart[] = result.filter(
          (cart: Cart) => id?.toString() === cart.productId?.toString()
        );
        if (item.length) {
          this.addCart = false;
          this.cartData = item[0];
        }
      });
    }
  }
}
