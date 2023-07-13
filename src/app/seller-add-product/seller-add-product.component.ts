import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css'],
})
export class SellerAddProductComponent implements OnInit {
  addProductMessage: string | undefined = '';
  constructor(private productService: ProductService, private router: Router) {}
  ngOnInit(): void {}

  submitProduct(data: Product) {
    let JwtResponse = localStorage.getItem('JwtResponse');
    let JwtResponseObj = JwtResponse && JSON.parse(JwtResponse);
    let sellerId = JwtResponseObj.seller.sellerId;
    let productData: Product = {
      ...data,
      sellerId,
    };
    this.productService.addProduct(productData).subscribe((result) => {
      if (result) {
        this.addProductMessage = 'Product Added Successfully';
      }
      setTimeout(() => {
        this.addProductMessage = undefined;
        this.router.navigate(['seller-home']);
      }, 3000);
    });
  }
}
