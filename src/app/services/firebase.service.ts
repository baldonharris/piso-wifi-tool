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
    );
  }

  saveOrders(orders: any): Observable<any> {
    return this.httpClient.post(environment.firebase.orders, orders);
  }

  get(type: firebase): Observable<any> {
    return this.httpClient.get(environment.firebase[type]);
  }

  save(type: firebase, data: any, path?: string): Observable<any> {
    if (!!path) {
      console.log('heeeyy!!');
      const newData = { [path]: data };

      return this.httpClient.patch(environment.firebase[type], newData);
    } else {
      return this.httpClient.post(environment.firebase[type], data);
    }
  }
}
