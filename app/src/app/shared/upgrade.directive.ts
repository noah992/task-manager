import { Directive, ElementRef, HostListener } from '@angular/core';

// change color when hover in plan page

@Directive({
  selector: '[appUpgrade]'
})
export class UpgradeDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('rgb(70, 150, 70)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }

  highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
