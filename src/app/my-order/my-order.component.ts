import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Order } from '../data-type';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css'],
})
export class MyOrderComponent implements OnInit {
  orderData: undefined | Order[];
  user = localStorage.getItem('user');
  userId = this.user && JSON.parse(this.user)[0].userId;
  orderMessage: string | undefined;
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.getOrderList();
  }

  cancelOrder(orderId: number | undefined) {
    orderId &&
      this.productService.cancelOrder(orderId).subscribe((result) => {
        alert('Order Canceled');
        this.getOrderList();
      });
  }
  getOrderList() {
    this.productService.orderData(this.userId).subscribe((result) => {
      this.orderData = result;
      if (result.length === 0) {
        this.orderMessage = 'No Order Data Available';
      }
    });
  }
}
