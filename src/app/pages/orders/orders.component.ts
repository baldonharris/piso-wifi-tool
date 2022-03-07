import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

interface Item {
  item: string;
  date_ordered: string;
  paid_by: string;
  paid_in_behalf_by: string;
  quantity: number;
  price: number;
  cost: number;
  shipping_fee: number;
  paid_in_behalf_amount: number;
  subtotal: number;
  total: number;
}

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

  constructor(private notification: NzNotificationService, private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders() {
    this.isFetchingOrders = true;
    this.httpClient
      .get(environment.firebase.orders)
      .pipe(
        map((orders) => {
          const newOrders = Object.values(orders);
          const items: Item[] = [];

          // @ts-ignore
          newOrders.sort((a, b) => new Date(b.date_ordered) - new Date(a.date_ordered));

          for (let order of newOrders) {
            for (let item of order.items) {
              items.push({
                item: item.item,
                date_ordered: order.date_ordered,
                paid_by: order.paid_by,
                paid_in_behalf_by: order.paid_in_behalf_by || '-',
                quantity: item.quantity,
                price: item.price,
                cost: item.cost,
                shipping_fee: item.shipping_fee,
                paid_in_behalf_amount: item.paid_in_behalf_amount,
                subtotal: item.subtotal,
                total: item.total
              });
            }
          }

          return items;
        })
      )
      .subscribe((items: Item[]) => {
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

  getCurrentOrder(index: number) {
    return index + (this.currentPage - 1) * 10;
  }
}
