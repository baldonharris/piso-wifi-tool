import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseService, Item } from '../../services/firebase.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orderModalShow: boolean = false;
  items: Item[] = [];
  isFetchingOrders: boolean = true;
  currentPage: number = 1;

  constructor(private notification: NzNotificationService, private firebase: FirebaseService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders() {
    this.isFetchingOrders = true;
    this.firebase.getOrders().subscribe((items: Item[]) => {
      this.items = items;
      this.isFetchingOrders = false;
    });
  }

  onAddOrder() {
    this.orderModalShow = true;
  }

  onCancelModal() {
    this.orderModalShow = false;
  }

  onOrderAdded(order: any) {
    this.notification.success('Success!', 'Order successfully added.');
    this.orderModalShow = false;
    this.fetchOrders();
  }

  onPaginate(page: number) {
    this.currentPage = page;
  }

  onPay(data: Item, investor: string) {
    if (data.status === 'unpaid') {
      this.isFetchingOrders = true;
      this.firebase
        .update('orders', {
          [`${data.path}/status`]: 'paid',
          [`${data.id}/paid_by`]: 'Earnings'
        })
        .subscribe(() => {
          data.status = 'paid';
          this.isFetchingOrders = false;
        });
    }
  }

  getCurrentOrder(index: number) {
    return index + (this.currentPage - 1) * 10;
  }
}
