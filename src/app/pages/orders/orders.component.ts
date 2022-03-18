import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FirebaseService, Item } from '../../services/firebase.service';
import { map } from 'rxjs/operators';

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
    this.firebase
      .get('orders')
      .pipe(
        map((orders) => {
          const newOrders = Object.values(orders);
          const items: Item[] = [];

          for (let [key, order] of Object.entries(orders)) {
            // @ts-ignore
            for (let item of order.items) {
              items.push({
                id: key,
                // @ts-ignore
                path: `${key}/items/${order.items.indexOf(item)}`,
                item: item.item,
                status: !!item.status ? item.status : 'unpaid',
                // @ts-ignore
                date_ordered: order.date_ordered,
                // @ts-ignore
                paid_by: order.paid_by,
                // @ts-ignore
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

          // @ts-ignore
          items.sort((a, b) => new Date(b.date_ordered) - new Date(a.date_ordered));

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

  onPay(data: Item) {
    if (data.status === 'unpaid') {
      this.isFetchingOrders = true;
      this.firebase.save('orders', 'paid', `${data.path}/status`).subscribe((r) => {
        data.status = 'paid';
        this.isFetchingOrders = false;
      });
    }
  }

  getCurrentOrder(index: number) {
    return index + (this.currentPage - 1) * 10;
  }
}
