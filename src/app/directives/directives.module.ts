import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlockDirective } from './block.directive';

@NgModule({
  declarations: [BlockDirective],
  imports: [CommonModule],
  exports: [BlockDirective]
})
export class DirectivesModule {}
