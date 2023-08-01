import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { FileHandle, Product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined = '';
  productImages: FileHandle[] = [];
  constructor(private productService: ProductService, private router: Router) {}
  ngOnInit(): void {}

  submitProduct(data: any) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let sellerId = JwtResponseObj.seller.sellerId;
    let productData: Product = {
      ...data,
      sellerId,
      productImages: this.productImages,
    };
    const formData = this.prepareFormData(productData);
    this.productService.addProduct(formData).subscribe((result) => {
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
