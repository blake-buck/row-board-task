import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector:'[vertical-scrolling]'
})

export class VerticalScrollingDirective{
    startScrollingBoundary = 125;
    @HostListener('dragover', ['$event.screenY']) onDragOver(screenY){

        if(screenY < this.startScrollingBoundary){
            // scroll up
            document.scrollingElement.scrollTop -= 10;
        }
        else if(screenY > window.innerHeight - this.startScrollingBoundary){
            // scroll down
            document.scrollingElement.scrollTop += 10;
        }
    }
}