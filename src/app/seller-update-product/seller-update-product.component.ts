import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { FileHandle, Image, Product, ProductResponse } from '../data-type';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css'],
})
export class SellerUpdateProductComponent implements OnInit {
  productData!: ProductResponse;
  updateProductMessage: string | undefined;
  addProduct!: FormGroup;
  sellerId!: number;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private sellerService: SellerService,
    private router: Router
  ) {
    this.addProduct = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.sellerService.getSellerId().subscribe((result) => {
      if (result) {
        this.sellerId = result;
      }
    });
    let productId = this.route.snapshot.paramMap.get('id');
    productId &&
      this.productService.getProduct(+productId).subscribe((data) => {
        if (data) {
          this.productData = data;
          this.addProduct.patchValue({
            productName: data.productName,
            price: data.price,
            color: data.color,
            category: data.category,
            description: data.description,
          });
          this.addProduct.updateValueAndValidity();
        }
      });
  }

  updateProduct() {
    let data: ProductResponse = this.addProduct.value;
    data.sellerId = this.sellerId;
    if (this.productData) {
      data.productId = this.productData.productId;
      data.productImages = this.productData.productImages;
    }
    this.productService.updateProduct(data).subscribe((result) => {
      if (result) {
        this.updateProductMessage = 'Product Updated Successfully';
      }
      setTimeout(() => {
        this.updateProductMessage = undefined;
        this.router.navigate(['seller-home']);
      }, 1000);
    });
  }
}
