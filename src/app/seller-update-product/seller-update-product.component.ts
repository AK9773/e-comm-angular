import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | Product;
  updateProductMessage: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    productId &&
      this.productService.getProduct(productId).subscribe((data) => {
        this.productData = data;
      });
  }
  updateProduct(data: Product) {
    if (this.productData) {
      data.productId = this.productData.productId;
    }
    this.productService.updateProduct(data).subscribe((result) => {
      if (result) {
        this.updateProductMessage = 'Project Updated Successfully';
      }
      setTimeout(() => {
        this.updateProductMessage = undefined;
        this.router.navigate(['seller-home']);
      }, 1000);
    });
  }
}
