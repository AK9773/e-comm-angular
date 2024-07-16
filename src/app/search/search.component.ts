import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';
import { takeUntil } from 'rxjs';
import { Unsubscribe } from '../services/unsubscribe.class';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent extends Unsubscribe implements OnInit {
  searchResult: ProductResponse[] | undefined;

  constructor(private productService: ProductService) {
    super();
  }
  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.productService.query.subscribe((res) => {
      if (res.length !== 0) {
        this.productService
          .searchProduct(res)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((result) => {
            this.searchResult = result;
            console.log(this.searchResult);
          });
      }
    });
  }
}
