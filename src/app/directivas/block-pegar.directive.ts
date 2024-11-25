import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appBlockPegar]',
  standalone: true
})
export class BlockPegarDirective {

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    // no pegar
    event.preventDefault();
  }

}
