import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from '../services/unsubscribe.class';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent extends Unsubscribe implements OnInit {
  productList: ProductResponse[] | undefined;

  constructor(private productService: ProductService) {
    super();
  }

  ngOnInit(): void {
    this.productService
      .productList()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((result) => {
        this.productList = result;
      });
  }
}
