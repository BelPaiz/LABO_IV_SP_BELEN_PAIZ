import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPrimeraMayuscula]',
  standalone: true
})
export class PrimeraMayusculaDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const inputElement = this.el.nativeElement;
    const value = inputElement.value;
    inputElement.value = this.capitalizeWords(value);
  }

  private capitalizeWords(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

}
