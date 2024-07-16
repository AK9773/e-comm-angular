import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { SellerService } from '../services/seller.service';
import { Unsubscribe } from '../services/unsubscribe.class';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent extends Unsubscribe implements OnInit {
  productList: undefined | ProductResponse[];
  deleteProductMessage: string | undefined;
  deleteIcon = faTrash;
  editIcon = faEdit;
  productListMessage: string | undefined;
  sellerId: number | undefined;

  constructor(
    private productService: ProductService,
    private sellerService: SellerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sellerService
      .getSellerId()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((sellerId) => {
        if (sellerId) {
          this.sellerId = sellerId;
          this.list();
        }
      });
  }

  productDelete(id: number) {
    if (confirm('Are you sure to delete this product?')) {
      this.productService
        .deleteProduct(id)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(() => {
          this.deleteProductMessage = 'Product Deleted Successfully';
          this.list();
        });
      setTimeout(() => {
        this.deleteProductMessage = undefined;
      }, 3000);
    }
  }

  list() {
    if (this.sellerId) {
      this.productService
        .sellerProductList(this.sellerId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((products) => {
          if (products) {
            this.productList = products;
          }
          if (products.length === 0) {
            this.productListMessage = 'No Product Added';
          }
        });
    }
  }
}
