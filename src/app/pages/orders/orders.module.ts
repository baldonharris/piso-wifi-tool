import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { DirectivesModule } from '../../directives/directives.module';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AddItemModalComponent } from './add-item-modal/add-item-modal.component';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [OrdersComponent, AddItemModalComponent],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDividerModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzAutocompleteModule,
    DirectivesModule,
    NzEmptyModule,
    NzModalModule,
    NzNotificationModule,
    NzTableModule,
    NzCardModule,
    NzBadgeModule,
    NzAlertModule,
    NzIconModule,
    NzTagModule
  ]
})
export class OrdersModule {}
