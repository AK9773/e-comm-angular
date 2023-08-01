import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { FileHandle, Image, Product, ProductResponse } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  productData: undefined | ProductResponse;
  updateProductMessage: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    let productId = this.route.snapshot.paramMap.get('id');
    productId &&
      this.productService.getProduct(+productId).subscribe((data) => {
        this.productData = data;
      });
  }

  updateProduct(data: ProductResponse) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    data.sellerId = JwtResponseObj.seller.sellerId;
    if (this.productData) {
      data.productId = this.productData.productId;
      data.productImages = this.productData.productImages;
    }
    this.productService.updateProduct(data).subscribe((result) => {
      console.log(result);
      if (result) {
        console.log(result);

        this.updateProductMessage = 'Product Updated Successfully';
      }
      setTimeout(() => {
        this.updateProductMessage = undefined;
        this.router.navigate(['seller-home']);
      }, 1000);
    });
  }
}
