import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product, ProductResponse } from '../data-type';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchResult: ProductResponse[] | undefined;
  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    let query = this.activeRoute.snapshot.paramMap.get('query');
    query &&
      this.productService.searchProduct(query).subscribe((result) => {
        this.searchResult = result;
      });
  }
}
