import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | Product[];
  deleteProductMessage: string | undefined;
  deleteIcon = faTrash;
  editIcon = faEdit;
  productListMessage: string | undefined;
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.list();
  }
  productDelete(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.deleteProductMessage = 'Product Deleted Successfully';
      this.list();
    });
    setTimeout(() => {
      this.deleteProductMessage = undefined;
    }, 3000);
  }

  list() {
    let seller = localStorage.getItem('seller');
    let sellerId = seller && JSON.parse(seller)[0].sellerId;
    this.productService.sellerProductList(sellerId).subscribe((result) => {
      if (result) {
        this.productList = result;
      }
      if (result.length === 0) {
        this.productListMessage = 'No Product Added';
      }
    });
  }
}
