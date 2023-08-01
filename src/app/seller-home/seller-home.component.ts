import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | ProductResponse[];
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
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    this.productService
      .sellerProductList(JwtResponseObj.seller.sellerId)
      .subscribe((result) => {
        if (result) {
          this.productList = result;
        }
        if (result.length === 0) {
          this.productListMessage = 'No Product Added';
        }
      });
  }
}
