import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Item as I } from '../pages/orders/add-item-modal/add-item-modal.component';

type firebase = 'orders' | 'earnings';

export interface Item extends I {
  id?: string;
  path?: string;
  date_ordered: string;
  paid_by: string;
  paid_in_behalf_by: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private httpClient: HttpClient) {}

  getOrders(): Observable<Item[]> {
    return this.httpClient.get(environment.firebase.orders).pipe(
      map((orders) => {
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
              paid_by: order.paid_by || '-',
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
    );
  }

  get(type: firebase): Observable<any> {
    return this.httpClient.get(environment.firebase[type]);
  }

  insert(type: firebase, data: any, path?: string): Observable<any> {
    return this.httpClient.post(environment.firebase[type], data);
  }

  update(type: firebase, data: any): Observable<any> {
    return this.httpClient.patch(environment.firebase[type], data);
  }
}
