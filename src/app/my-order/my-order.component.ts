import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Order } from '../data-type';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.css'],
})
export class MyOrderComponent implements OnInit {
  orderData: undefined | Order[];
  JwtResponse = localStorage.getItem('JwtResponse');
  JwtResponseObj = this.JwtResponse && JSON.parse(this.JwtResponse);
  user = this.JwtResponseObj && this.JwtResponseObj.user;
  userId: number | undefined;
  orderMessage: string | undefined;

  constructor(
    private productService: ProductService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    if (localStorage.getItem('JwtResponse')) {
      this.userService.getUserId().subscribe((result) => {
        if (result) {
          this.userId = result;
          this.getOrderList();
        }
      });
    }
  }

  cancelOrder(orderId: number | undefined) {
    orderId &&
      this.productService.cancelOrder(orderId).subscribe((result) => {
        alert('Order Canceled');
        this.getOrderList();
      });
  }

  getOrderList() {
    if (this.userId) {
      this.productService.orderData(this.userId).subscribe((result) => {
        this.orderData = result;
        if (result.length === 0) {
          this.orderMessage = 'No Order Data Available';
        }
      });
    }
  }
}
