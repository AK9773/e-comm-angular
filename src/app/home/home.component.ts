import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList: ProductResponse[] | undefined;
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.productList().subscribe((result) => {
      this.productList = result;
    });
  }
}
