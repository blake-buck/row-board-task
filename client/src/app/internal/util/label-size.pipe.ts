import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'labelSize'
})

export class LabelSizePipe implements PipeTransform{
    transform(textLength){
        // Firefox and chrome textareas have different methods of sizing text areas
        if(window.navigator.userAgent.includes('Firefox')){
            return textLength;
        }
        return textLength  > 1 ? textLength -1 : 1
    }
}