import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector:'[input-autofocus]'
})

export class InputAutofocusDirective{
    constructor(el: ElementRef){
        setTimeout(() => el.nativeElement.focus(), 0);
    }
}