import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMayusculasNombre]',
  standalone: true
})
export class MayusculasNombreDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    const textContent = this.el.nativeElement.textContent;
    this.renderer.setProperty(this.el.nativeElement, 'textContent', textContent.toUpperCase());
  }

}
