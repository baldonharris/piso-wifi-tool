import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orderModalShow: boolean = false;

  constructor(private notification: NzNotificationService) {}

  ngOnInit(): void {}

  onAddOrder() {
    this.orderModalShow = true;
  }

  onCancelModal() {
    this.orderModalShow = false;
  }

  onOrderAdded(order: any) {
    this.notification.success('Success!', 'Order successfully added.');
    this.orderModalShow = false;
  }
}
