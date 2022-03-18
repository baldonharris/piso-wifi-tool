import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { UtilsService } from '../../../services/utils.service';
import { FirebaseService } from '../../../services/firebase.service';

export interface Item {
  item: string;
  quantity: number;
  price: number;
  cost: number;
  shipping_fee: number;
  paid_in_behalf_amount: number;
  subtotal: number;
  total: number;
  status?: 'paid' | 'unpaid';
}

interface Order {
  id: string;
  date_ordered: string;
  shipping_fee: number;
  paid_by: string;
  paid_in_behalf_by: string;
  paid_in_behalf_amount: number;
  items: Item[];
}

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item-modal.component.html',
  styleUrls: ['./add-item-modal.component.css']
})
export class AddItemModalComponent implements OnInit {
  @Output() onOrderAdded: EventEmitter<Order> = new EventEmitter<Order>();

  investors: string[] = [];
  components: string[] = [];
  isSubmitting: boolean = false;

  orderForm: FormGroup = this.fb.group({
    date_ordered: this.fb.control(''),
    shipping_fee: this.fb.control(0),
    paid_by: this.fb.control(''),
    paid_in_behalf_by: this.fb.control(null),
    paid_in_behalf_amount: this.fb.control(0),
    items: this.fb.array([])
  });

  constructor(private fb: FormBuilder, private utils: UtilsService, private firebase: FirebaseService) {
    this.components = this.utils.getComponents();
    this.investors = this.utils.getInvestors('Earnings');
  }

  ngOnInit(): void {
    this.orderForm
      .get('shipping_fee')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe((shippingFee) => {
        this.distributeShippingFee(Number(shippingFee));
      });
    this.orderForm
      .get('paid_in_behalf_amount')!
      .valueChanges.pipe(debounceTime(500))
      .subscribe((amount) => {
        this.distributeBehalfAmount(Number(amount));
      });
  }

  private distributeShippingFee(shippingFee: number) {
    const distributedSF = this.utils.roundUp(shippingFee / this.items.controls.length);
    for (let item of this.items.controls) {
      // @ts-ignore
      item.controls['shipping_fee'].setValue(distributedSF);
    }
  }

  private distributeBehalfAmount(amount: number) {
    const distributedAmount = this.utils.roundUp(amount / this.items.controls.length);
    for (let item of this.items.controls) {
      // @ts-ignore
      item.controls['paid_in_behalf_amount'].setValue(distributedAmount);
    }
  }

  private createOrderItem(): FormGroup {
    return this.fb.group({
      item: [null],
      quantity: [0],
      price: [0],
      cost: [0],
      shipping_fee: [0],
      paid_in_behalf_amount: [0],
      subtotal: [0],
      total: [0]
    });
  }

  get items(): FormArray {
    return <FormArray>this.orderForm.get('items');
  }

  onAddItem() {
    let item = this.createOrderItem();

    this.items.push(item);
    this.distributeShippingFee(Number(this.orderForm.get('shipping_fee')!.value));
    this.distributeBehalfAmount(Number(this.orderForm.get('paid_in_behalf_amount')!.value));

    item.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      const price = Number(item.get('price')!.value);
      const quantity = Number(item.get('quantity')!.value);
      const cost = this.utils.roundUp(price * quantity);
      const shippingFee = Number(item.get('shipping_fee')!.value);
      const subtotal = this.utils.roundUp(cost + shippingFee);
      const paidInBehalfAmount = Number(item.get('paid_in_behalf_amount')!.value);
      const total = this.utils.roundUp(subtotal - paidInBehalfAmount);

      item.controls['cost'].setValue(cost);
      item.controls['subtotal'].setValue(subtotal);
      item.controls['total'].setValue(total);
    });
  }

  onSubmit() {
    this.isSubmitting = true;
    this.firebase.insert('orders', this.orderForm.value).subscribe((newOrder: any) => {
      this.orderForm.reset();
      this.isSubmitting = false;
      this.onOrderAdded.emit(newOrder);
    });
  }
}
