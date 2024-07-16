import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FileHandle, Product } from '../data-type';
import { Router } from '@angular/router';
import { SellerService } from '../services/seller.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Unsubscribe } from '../services/unsubscribe.class';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent extends Unsubscribe implements OnInit {
  addProductMessage: string | undefined = '';
  productImages: FileHandle[] = [];
  sellerId: number | undefined;
  addProduct!: FormGroup;

  constructor(
    private productService: ProductService,
    private sellerService: SellerService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.addProduct = new FormGroup({
      productName: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      color: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
    this.sellerService
      .getSellerId()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.sellerId = result;
        }
      });
  }

  submitProduct() {
    let data = this.addProduct.value;
    let productData: Product = {
      ...data,
      sellerId: this.sellerId,
      productImages: this.productImages,
    };
    const formData = this.prepareFormData(productData);
    this.productService
      .addProduct(formData)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.addProductMessage = 'Product Added Successfully';
        }
        setTimeout(() => {
          this.addProductMessage = undefined;
          this.router.navigate(['seller-home']);
        }, 3000);
      });
  }

  onSelectedFile(event: any) {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const fileHandle: FileHandle = {
          file: file,
        };
        this.productImages.push(fileHandle);
      }
    }
  }

  prepareFormData(product: Product): FormData {
    const formData = new FormData();
    formData.append(
      'Product',
      new Blob([JSON.stringify(product)], { type: 'application/json' })
    );
    for (let index = 0; index < product.productImages.length; index++) {
      formData.append(
        'Images',
        product.productImages[index].file,
        product.productImages[index].file.name
      );
    }
    return formData;
  }
}
