import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList: Product[] | undefined;
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.productList().subscribe((result) => {
      this.productList = result;
    });
  }
}
