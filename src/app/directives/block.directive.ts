import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appBlock]'
})
export class BlockDirective {

  constructor(private el: ElementRef) {
    this.el.nativeElement.style.display = 'block';
    this.el.nativeElement.style.width = '100%';
  }

}
