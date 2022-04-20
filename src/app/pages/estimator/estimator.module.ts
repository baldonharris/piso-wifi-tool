import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstimatorRoutingModule } from './estimator-routing.module';
import { EstimatorComponent } from './estimator.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [EstimatorComponent],
  imports: [CommonModule, EstimatorRoutingModule, NzTableModule, NzGridModule, NzButtonModule]
})
export class EstimatorModule {}
